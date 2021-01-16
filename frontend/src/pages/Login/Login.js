import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { UncontrolledAlert } from 'reactstrap';

import { useFormik } from 'formik';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { loginUserWithEmail } from '../../store/actions/authActions';
import { GOOGLE_AUTH_LINK } from '../../constants';
import { loginSchema } from './validation';
import './styles.css';

const Login = ({ register, auth, history, loginUserWithEmail }) => {
	const formik = useFormik({
		initialValues: {
			email: '',
			password: ''
		},
		// validationSchema: loginSchema,
		onSubmit: (values) => {
			loginUserWithEmail(values, history);
		}
	});

	if (auth.isAuthenticated) return <Redirect to="/" />;

	// To display an alert for successful registration when redirected from registration page
	var display_alert =
		register.successful_email_registration === true
			? { visibility: 'visible' }
			: { display: 'none' };

	return (
		<div className="login container">
			<div className="container">
				<UncontrolledAlert color="success" style={display_alert}>
					User registered successfully! You can login now or later as you
					please.
				</UncontrolledAlert>

				<h1>Log in page</h1>
				<p>
					back to{' '}
					<Link className="bold" to="/">
						Home page
					</Link>
				</p>
				<form onSubmit={formik.handleSubmit}>
					<a className="google btn" href={GOOGLE_AUTH_LINK}>
						<i className="fa fa-google fa-fw" />
						Login with Google
					</a>
					<br />
					<h2>OR</h2>
					<br />
					<h4>Login with email address</h4>
					<div>
						<input
							placeholder="Email address"
							name="email"
							className="text"
							type="text"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
						/>
						{formik.touched.email && formik.errors.email ? (
							<p className="error">{formik.errors.email}</p>
						) : null}
						<input
							placeholder="Password"
							name="password"
							type="password"
							className="text"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
						/>
						{formik.touched.password && formik.errors.password ? (
							<p className="error">{formik.errors.password}</p>
						) : null}
					</div>
					{auth.error && <p className="error">{auth.error}</p>}
					<div>
						<button
							className="btn submit"
							disabled={auth.isLoading || !formik.isValid}
							type="submit"
						>
							Log in
						</button>
					</div>
					<div>
						Don't have an account?{' '}
						<Link className="bold" to="/register">
							Register
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
	register: state.register
});

export default compose(
	withRouter,
	connect(mapStateToProps, { loginUserWithEmail })
)(Login);
