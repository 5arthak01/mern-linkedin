import React from 'react';
import { connect } from 'react-redux';
import JobApplicant from './JobApplicant';
import JobRecruiter from './JobRecruiter';

// Note: `job` is an individual job passed in JobList
const Job = ({ auth, job, key }) => {
	if (auth.isAuthenticated) {
		if (auth.me.role == 'applicant')
			return <JobApplicant key={key} job={job} />;
		else if (auth.me.role == 'recruiter')
			return <JobRecruiter key={key} job={job} />;
		else return <></>;
	}
	return <></>;
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Job);
