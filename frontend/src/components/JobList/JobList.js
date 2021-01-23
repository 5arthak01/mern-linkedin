import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Job from '../Job/Job';
import Loader from '../Loader/Loader';

import { getJobs } from '../../store/actions/jobActions';

// const JobList = ({ getJobs, job: { jobs, isLoading, error } }) => {
const JobList = ({ getJobs, job }) => {
	useEffect(() => {
		console.log('In Joblist use effect');
		getJobs();
	}, []);

	return (
		<div className="job-list">
			<h2>Jobs:</h2>
			{job.error && <div className="error-center">{job.error}</div>}
			<div className="list">
				{job.isLoading ? (
					<Loader />
				) : (
					<>
						{job.jobs.map((job, index) => {
							return <Job key={index} job={job} />;
						})}
					</>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	job: state.job
});

export default connect(mapStateToProps, { getJobs })(JobList);
