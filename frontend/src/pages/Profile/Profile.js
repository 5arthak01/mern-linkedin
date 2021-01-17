import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import {
	getProfile,
	editUser,
	deleteUser
} from '../../store/actions/userActions';
import { loadMe } from '../../store/actions/authActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import { profileSchema } from './validation';

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './styles.css';

const Profile = ({
	getProfile,
	user: { profile, isLoading, error },
	auth: { me },
	editUser,
	deleteUser,
	loadMe,
	history,
	match
}) => {
	const [isEdit, setIsEdit] = useState(false);
	const [image, setImage] = useState(null);
	const [avatar, setAvatar] = useState(null);
	const retryCount = useRef(0);
	const matchUsername = match.params.username;

	useEffect(() => {
		getProfile(matchUsername, history);
	}, [matchUsername]);

	// if changed his own username reload me, done in userActions

	const onChange = (event) => {
		formik.setFieldValue('image', event.currentTarget.files[0]);
		setImage(URL.createObjectURL(event.target.files[0]));
		setAvatar(event.target.files[0]);
	};

	const handleClickEdit = () => {
		retryCount.current = 0;
		setIsEdit((oldIsEdit) => !oldIsEdit);
		setImage(null);
		setAvatar(null);
		formik.setFieldValue('id', profile.id);
		formik.setFieldValue('name', profile.name);
		formik.setFieldValue('username', profile.username);
	};

	const handleDeleteUser = (id, history) => {
		deleteUser(id, history);
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			id: '',
			name: '',
			username: '',
			password: ''
		},
		validationSchema: profileSchema,
		onSubmit: (values) => {
			const formData = new FormData();
			formData.append('avatar', avatar);
			formData.append('name', values.name);
			formData.append('username', values.username);
			if (profile.provider === 'email') {
				formData.append('password', values.password);
			}
			editUser(values.id, formData, history);
			//setIsEdit(false);
		}
	});

	return (
		<Layout>
			<div className="profile">
				<h1>Profile page</h1>
				<p>
					This is the profile page, the user can edit his own profile. Only
					authenticated users can see this page.
				</p>
				{isLoading ? (
					<Loader />
				) : (
					<div className="profile-info">
						<img src={image ? image : profile.avatar} className="avatar" />
						<div className="info-container">
							<div>
								<span className="Label">Provider: </span>
								<span className="info">{profile.provider}</span>
							</div>
							<div>
								<span className="Label">Role: </span>
								<span className="info">{profile.role}</span>
							</div>
							<div>
								<span className="Label">Name: </span>
								<span className="info">{profile.name}</span>
							</div>
							<div>
								<span className="Label">Username: </span>
								<span className="info">{profile.username}</span>
							</div>
							<div>
								<span className="Label">Email: </span>
								<span className="info">{profile.email}</span>
							</div>
							<div>
								<span className="Label">Joined: </span>
								<span className="info">
									{moment(profile.createdAt).format(
										'dddd, MMMM Do YYYY, H:mm:ss'
									)}
								</span>
							</div>
							<div>
								<Button
									className="btn"
									type="Button"
									onClick={handleClickEdit}
									disabled={!(me?.username === profile.username)}
								>
									{isEdit ? 'Cancel' : 'Edit'}
								</Button>
							</div>
						</div>
					</div>
				)}

				{error && <p className="error">{error}</p>}

				{isEdit && (
					<div className="form">
						<Form onSubmit={formik.handleSubmit}>
							<FormGroup>
								<Label for="Avatar">Avatar:</Label>
								<Input
									id="Avatar"
									name="image"
									type="file"
									onChange={onChange}
								/>
								{image && (
									<Button
										className="btn"
										onClick={() => {
											setImage(null);
											setAvatar(null);
										}}
										type="Button"
									>
										Remove Image
									</Button>
								)}
							</FormGroup>
							<FormGroup>
								<Input name="id" type="hidden" value={formik.values.id} />
							</FormGroup>
							<FormGroup>
								<Label for="name">Name:</Label>
								<Input
									placeholder="Name"
									name="name"
									id="name"
									className=""
									type="text"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.name}
								/>
								{formik.touched.name && formik.errors.name ? (
									<p className="error">{formik.errors.name}</p>
								) : null}
							</FormGroup>
							<FormGroup>
								<Label for="username">Username:</Label>
								<Input
									placeholder="Username"
									name="username"
									id="username"
									className=""
									type="text"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.username}
								/>
								{formik.touched.username && formik.errors.username ? (
									<p className="error">{formik.errors.username}</p>
								) : null}
							</FormGroup>
							{profile.provider === 'email' && (
								<FormGroup>
									<Label for="password">Password:</Label>
									<Input
										placeholder="Password"
										name="password"
										id="password"
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
							)}
							<Button type="submit" className="btn">
								Save
							</Button>
							<Button
								onClick={() => handleDeleteUser(profile.id, history)}
								type="Button"
								className="btn"
							>
								Delete profile
							</Button>
						</Form>
					</div>
				)}
			</div>
		</Layout>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	auth: state.auth
});

export default compose(
	requireAuth,
	withRouter,
	connect(mapStateToProps, { getProfile, editUser, deleteUser, loadMe })
)(Profile);
