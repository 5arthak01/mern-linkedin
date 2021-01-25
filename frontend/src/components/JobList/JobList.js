import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Job from '../Job/Job';
import Loader from '../Loader/Loader';
import { getJobs, filterJobs } from '../../store/actions/jobActions';
import {
	Table,
	Form,
	FormText,
	FormGroup,
	Input,
	Button,
	Label
} from 'reactstrap';
import moment from 'moment';

const JobList = ({
	filterJobs,
	getJobs,
	job: { jobs, isLoading, error, filtered }
}) => {
	const initialFormData = {
		searchbar: '',
		jobType: {
			fullTime: false,
			partTime: false,
			workFromHome: false
		},
		salary: {
			min: 0,
			max: 100000000000000
		},
		duration: 0
	};

	const [formData, updateForm] = useState(initialFormData);
	// Form fields handling
	const handleSearch = (e) => {
		updateForm({ ...formData, searchbar: e.target.value });
	};
	const handleJobTypeFull = (e) => {
		let jobType = formData.jobType;
		jobType.fullTime = !jobType.fullTime;
		updateForm({ ...formData, jobType });
	};
	const handleJobTypePart = (e) => {
		let jobType = formData.jobType;
		jobType.partTime = !jobType.partTime;
		updateForm({ ...formData, jobType });
	};
	const handleJobTypeHome = (e) => {
		let jobType = formData.jobType;
		jobType.workFromHome = !jobType.workFromHome;
		updateForm({ ...formData, jobType });
	};
	const handleSalaryMin = (e) => {
		let salary = formData.salary;
		salary.min = e.target.value;
		updateForm({ ...formData, salary });
	};
	const handleSalaryMax = (e) => {
		let salary = formData.salary;
		salary.max = e.target.value;
		updateForm({ ...formData, salary });
	};
	const handleDuration = (e) => {
		updateForm({ ...formData, duration: e.target.value });
	};

	// Form submission
	const handleSubmit = (event) => {
		event.preventDefault();
		if (formData.searchbar.length > 100) {
			alert('Too large title search');
		} else if (
			!(
				formData.jobType.fullTime ||
				formData.jobType.partTime ||
				formData.jobType.workFromHome
			)
		) {
			alert('No Job type was selected');
		} else if (
			formData.salary.min < 0 ||
			formData.salary.max < 0 ||
			formData.salary.min > 100000000000000 ||
			formData.salary.max > 100000000000000
		) {
			alert('Please select a salary between 0 and 100000000000000');
		} else if (formData.salary.min > formData.salary.max) {
			alert('Enter a valid salary filter');
		} else {
			filterJobs(formData);
		}
	};

	// Load all jobs when loading if no filter is applied
	useEffect(() => {
		if (filtered !== true) {
			getJobs();
		}
	}, []);

	return (
		<div className="List jobs">
			<div className="Filter jobs">
				<h2>Filters</h2>
				<Form onSubmit={handleSubmit}>
					<FormText>
						<h4>Search by Title</h4>
					</FormText>
					<FormGroup>
						<Input
							name="searchbar"
							id="searchbar"
							placeholder="Search jobs by title"
							onChange={handleSearch}
						/>
					</FormGroup>
					<FormText>
						<h4>Job type</h4>
					</FormText>
					<FormGroup check>
						<Label check>
							<Input
								id="Full-time"
								name="Full-time"
								type="checkbox"
								onChange={handleJobTypeFull}
							/>{' '}
							Full-time
						</Label>
					</FormGroup>
					<FormGroup check>
						<Label check>
							<Input
								id="Part-time"
								name="Part-time"
								type="checkbox"
								onChange={handleJobTypePart}
							/>{' '}
							Part-time
						</Label>
					</FormGroup>
					<FormGroup check>
						<Label check>
							<Input
								id="Work-from-home"
								name="Work-from-home"
								type="checkbox"
								onChange={handleJobTypeHome}
							/>{' '}
							Work-from-home
						</Label>
					</FormGroup>
					<FormText>
						<h4>Salary</h4>
					</FormText>
					<FormGroup>
						<Label for="MinSalary">From</Label>
						<Input
							name="MinSalary"
							id="MinSalary"
							type="number"
							placeholder="0"
							min="0"
							max="100000000000000"
							onChange={handleSalaryMin}
						/>
						<Label for="MaxSalary">To</Label>
						<Input
							name="MaxSalary"
							id="MaxSalary"
							type="number"
							placeholder="100000000000000"
							min="0"
							max="100000000000000"
							onChange={handleSalaryMax}
						/>
					</FormGroup>
					<FormText>
						<h4>Duration</h4>
					</FormText>
					<FormGroup>
						<Input
							type="select"
							name="Duration"
							id="Duration"
							onChange={handleDuration}
						>
							<option>Any</option>
							<option>1</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
							<option>5</option>
							<option>6</option>
							<option>7</option>
						</Input>
					</FormGroup>
					<Button
						className="btn"
						disabled={isLoading}
						type="submit"
						color="primary"
					>
						Submit
					</Button>
				</Form>
			</div>
			<br />

			<h2>Jobs:</h2>
			{error && <div className="error-center">{error}</div>}
			{isLoading ? (
				<Loader />
			) : (
				<Table bordered hover responsive>
					<thead>
						<tr>
							<th>Title</th>
							<th>Recruiter</th>
							<th>Salary</th>
							<th>Rating</th>
							<th>Deadline</th>
							<th>Required skills</th>
							<th>Duration</th>
							<th>Status</th>
						</tr>
					</thead>

					<tbody>
						{jobs.map((job, index) => {
							return moment(job.deadline).isBefore(moment()) ? null : (
								<Job key={job.id} job={job} />
							);
						})}
					</tbody>
				</Table>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	job: state.job
});

export default connect(mapStateToProps, { filterJobs, getJobs })(JobList);
