import React, { useState } from 'react';
import { connect } from 'react-redux';
import { applyJob } from '../../store/actions/jobActions';
import { List, Button, Form, Label, Input, FormGroup } from 'reactstrap';
import { useFormik } from 'formik';
import { sopSchema } from './validation';
import moment from 'moment';

const JobApplicant = ({ job, auth, applyJob, history, key }) => {
	const [isApplying, setIsApplying] = useState(false);

	const handleApply = (e) => {
		e.preventDefault();
		if (auth.me.selected || auth.me.jobs.length === 10) {
			alert(
				'You have already made the maximum number of applications for jobs'
			);
		} else {
			setIsApplying(true);
		}
	};

	const formik = useFormik({
		initialValues: {
			SOP: ''
		},
		validationSchema: sopSchema,
		onSubmit: (values) => {
			applyJob(job.id, auth.me.id, values.SOP, auth.me.username, history);
		}
	});

	let applyButton = (
		<Button
			type="submit"
			disabled={job.isLoading}
			color="primary"
			onClick={handleApply}
		>
			Apply
		</Button>
	);
	if (job.applicants && job.applicants.length) {
		if (job.applicants.includes(auth.me.id)) {
			applyButton = <Button color="success">Applied</Button>;
		} else if (job.applicants.length == job.maxApplications) {
			applyButton = <Button color="secondary">Full</Button>;
		}
	}

	return (
		<>
			<tr key={key} id={job.id}>
				<td>
					{job.title} <i>({job.jobType})</i>
				</td>
				<td>{job.recruiterName}</td>
				<td>{job.salary}</td>
				<td>{job.rating}</td>
				<td>{moment(job.deadline).format('hh:mm A, Do MMMM YYYY')}</td>
				<td>
					<List>
						<ul>
							{job.requiredSkills.map((skill, i) => (
								<li key={i}>{skill}</li>
							))}
						</ul>
					</List>
				</td>
				{job.duration === 0 ? (
					<td>
						<i>Indefinite</i>{' '}
					</td>
				) : (
					<td>{job.duration}</td>
				)}
				{/* <td>Recruiter Email: {job.recuiterEmail}</td> */}
				{/* <td>Maximum applications: {job.maxApplications}</td> */}
				{/* <td>Maximum positions available: {job.maxPositions}</td> */}
				{/* <td>Posted on: {job.creationDate}</td> */}
				<td className="Apply">{applyButton}</td>
			</tr>

			{isApplying && (
				<tr className="SOP">
					<td colSpan={8}>
						<br />
						<Form onSubmit={formik.handleSubmit}>
							<FormGroup>
								<Label for="SOP">Statement of Purpose</Label>
								<Input
									name="SOP"
									id="SOP"
									placeholder="Please enter a Statement of Purpose of not more than 250 words"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.SOP}
								/>
								{formik.touched.SOP && formik.errors.SOP ? (
									<p className="error">{formik.errors.SOP}</p>
								) : null}
							</FormGroup>
							<Button
								className="btn"
								disabled={!formik.isValid}
								type="submit"
								color="primary"
							>
								Submit
							</Button>
						</Form>
					</td>
				</tr>
			)}
		</>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { applyJob })(JobApplicant);
