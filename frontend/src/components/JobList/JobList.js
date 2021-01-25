import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Job from '../Job/Job';
import Loader from '../Loader/Loader';
import { getJobs } from '../../store/actions/jobActions';
import { Table, Form, FormGroup, Input, Button, Label } from 'reactstrap';
const JobList = ({ getJobs, job: { jobs, isLoading, error } }) => {
	useEffect(() => {
		getJobs();
	}, []);

	return (
		<div className="List jobs">
			<div></div>

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
							return <Job key={job.id} job={job} />;
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

export default connect(mapStateToProps, { getJobs })(JobList);
