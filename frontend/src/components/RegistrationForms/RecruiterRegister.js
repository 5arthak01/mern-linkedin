import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { useFormik } from 'formik';
import {
	Button,
	Form,
	FormGroup,
	FormText,
	Input,
	Container
} from 'reactstrap';
import { registerUserWithEmail } from '../../store/actions/registerActions';
import { recruiterSchema } from './validation';
import './styles.css';

const Register = ({
	auth,
	register: { isLoading, error },
	history,
	registerUserWithEmail
}) => {
	const formik = useFormik({
		initialValues: {
			name: '',
			username: '',
			email: '',
			password: ''
		},
		validationSchema: recruiterSchema,
		onSubmit: (values) => {
			registerUserWithEmail(values, history);
		}
	});

	if (auth.isAuthenticated) return <Redirect to="/" />;

	return (
		<div className="register">
			<Container>
				<h1>Register page</h1>
				<p>
					back to{' '}
					<Link className="bold" to="/">
						Home page
					</Link>
				</p>
				<Form onSubmit={formik.handleSubmit} noValidate>
					<FormText>Create new account</FormText>
					<FormGroup>
						<Input
							placeholder="Name"
							name="name"
							className=""
							type="text"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.name}
						/>
						{formik.touched.name && formik.errors.name ? (
							<p className="error">{formik.errors.name}</p>
						) : null}
						<Input
							placeholder="Username"
							name="username"
							className=""
							type="text"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.username}
						/>
						{formik.touched.username && formik.errors.username ? (
							<p className="error">{formik.errors.username}</p>
						) : null}
						<Input
							placeholder="Email address"
							name="email"
							className=""
							type="text"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
						/>
						{formik.touched.email && formik.errors.email ? (
							<p className="error">{formik.errors.email}</p>
						) : null}
						<Input
							placeholder="Password"
							name="password"
							className=""
							type="password"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
						/>
						{formik.touched.password && formik.errors.password ? (
							<p className="error">{formik.errors.password}</p>
						) : null}
					</FormGroup>
					{error && <p className="error">{error}</p>}
					<div>
						<Button
							className="btn submit"
							type="submit"
							disabled={isLoading || !formik.isValid}
						>
							Sign up now
						</Button>
					</div>
					<div>
						If you already have an account or want to sign-in with google, you
						can{' '}
						<Link className="bold" to="/login">
							Log In
						</Link>
					</div>
				</Form>
			</Container>
		</div>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	register: state.register
});

export default compose(
	withRouter,
	connect(mapStateToProps, { registerUserWithEmail })
)(Register);
