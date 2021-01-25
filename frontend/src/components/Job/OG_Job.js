/***
DEPRECATED
 * ***/
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useFormik } from 'formik';

import {
	deleteJob,
	editJob,
	clearJobError
} from '../../store/actions/jobActions';
import { jobFormSchema } from './validation';

import './styles.css';

const Job = ({ job, auth, deleteJob, editJob, clearJobError }) => {
	const [isEdit, setIsEdit] = useState(false);

	const handleDelete = (e, id) => {
		e.preventDefault();
		if (!isEdit) {
			deleteJob(id);
		}
	};

	const handleClickEdit = (e) => {
		e.preventDefault();
		formik.setFieldValue('text', job.text);
		setIsEdit((oldIsEdit) => !oldIsEdit);
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			text: '',
			id: job.id
		},
		validationSchema: jobFormSchema,
		onSubmit: (values, { resetForm }) => {
			editJob(values.id, { text: values.text });
			setIsEdit(false);
			// resetForm();
		}
	});

	// dont reset form if there is an error
	useEffect(() => {
		if (!job.error && !job.isLoading) formik.resetForm();
	}, [job.error, job.isLoading]);

	// keep edit open if there is an error
	useEffect(() => {
		if (job.error) setIsEdit(true);
	}, [job.error]);

	return (
		<div className={job.isLoading ? 'job loader' : 'job'}>
			<div className="job-header">
				<Link to={`/${job.user.username}`}>
					<img src={job.user.avatar} className="avatar" />
				</Link>
				<div>
					<Link to={`/${job.user.username}`} className="name">
						{job.user.name}
					</Link>
					<span className="username">@{job.user.username}</span>
					<span className="time text-light">
						{moment(job.createdAt).fromNow()}
					</span>
					{!moment(job.createdAt).isSame(job.updatedAt, 'minute') && (
						<span className="time text-light">{`Edited: ${moment(
							job.updatedAt
						).fromNow()}`}</span>
					)}
				</div>
			</div>
			<form onSubmit={formik.handleSubmit}>
				{isEdit ? (
					<>
						<textarea
							name="text"
							rows="3"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.text}
							disabled={job.isLoading}
						/>
						<input type="hidden" name="id" />
						{(formik.touched.text && formik.errors.text) || job.error ? (
							<p className="error">{formik.errors.text || job.error}</p>
						) : null}
					</>
				) : (
					<p>{job.text}</p>
				)}
				{auth.isAuthenticated &&
					(auth.me.id === job.user.id || auth.me.role === 'ADMIN') && (
						<>
							{!isEdit ? (
								<>
									<button
										onClick={handleClickEdit}
										type="button"
										className="btn"
									>
										Edit
									</button>
									<button
										onClick={(e) => handleDelete(e, job.id)}
										type="button"
										className="btn"
									>
										Delete
									</button>
								</>
							) : (
								<>
									<button
										type="submit"
										className="btn"
										disabled={job.isLoading}
									>
										Submit
									</button>
									<button
										onClick={() => {
											setIsEdit((oldIsEdit) => !oldIsEdit);
											clearJobError(job.id);
										}}
										type="button"
										className="btn"
									>
										Cancel
									</button>
								</>
							)}
						</>
					)}
			</form>
		</div>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { deleteJob, editJob, clearJobError })(
	Job
);
