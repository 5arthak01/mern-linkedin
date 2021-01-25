import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from '../../layout/Layout';
import JobList from '../../components/JobList/JobList';
import JobForm from '../../components/JobForm/JobForm';

const Home = ({ auth }) => {
	return (
		<Layout>
			<div className="home-page">
				<h1>Home page</h1>
				{!auth.isAuthenticated ? (
					<div>
						<p>
							Welcome guest!{' '}
							<Link to="/login">
								<b>Log in</b>
							</Link>{' '}
							or{' '}
							<Link to="/register">
								<b>Register</b>
							</Link>
						</p>
					</div>
				) : (
					<>
						<p>
							Welcome <span className="name">{auth.me.name}</span>!
						</p>
						{/* <JobForm /> */}
						<JobList />
					</>
				)}
			</div>
		</Layout>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default compose(connect(mapStateToProps, {}))(Home);
