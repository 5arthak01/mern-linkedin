import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import {
	UncontrolledAlert,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText
} from 'reactstrap';

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
		validationSchema: loginSchema,
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
				<br />
				<div>
					<h1 style={{ textAlign: 'center' }}>Log in page</h1>
					<p style={{ textAlign: 'center' }}>
						back to{' '}
						<Link className="bold" to="/">
							Home page
						</Link>
					</p>
				</div>
				<br />
				<br />
				<Form onSubmit={formik.handleSubmit}>
					<h4>Login with email address</h4>
					<FormGroup>
						<Label for="Email_field">Email</Label>
						<Input
							placeholder="Email address"
							name="email"
							className="text"
							type="text"
							id="Email_field"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
						/>
						{formik.touched.email && formik.errors.email ? (
							<p className="error">{formik.errors.email}</p>
						) : null}
						<Label for="Pass_field">Password</Label>
						<Input
							placeholder="Password"
							name="password"
							type="password"
							id="Pass_field"
							className="text"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
						/>
						{formik.touched.password && formik.errors.password ? (
							<p className="error">{formik.errors.password}</p>
						) : null}
					</FormGroup>
					{auth.error && <p className="error">{auth.error}</p>}
					<Button
						className="btn submit"
						disabled={auth.isLoading || !formik.isValid}
						type="submit"
					>
						Log in
					</Button>
					<br />
					<h2 style={{ textAlign: 'center' }}>OR</h2>
					<br />
					<FormGroup>
						<a className="google btn" href={GOOGLE_AUTH_LINK}>
							<i className="fa fa-google fa-fw" />
							Login with Google
						</a>
					</FormGroup>
					<br />
					<br />
					<div style={{ textAlign: 'center' }}>
						Don't have an account and don't want to authenticate through Google?{' '}
						<Link className="bold" to="/register">
							Register
						</Link>
					</div>
				</Form>
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
