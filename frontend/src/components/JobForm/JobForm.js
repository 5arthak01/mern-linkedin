import React from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import { addJob } from '../../store/actions/jobActions';
import { jobFormSchema } from './validation';

import './styles.css';

const JobForm = ({ addJob, job: { jobs } }) => {
	const formik = useFormik({
		initialValues: {
			text: ''
		},
		validationSchema: jobFormSchema,
		onSubmit: (values, { resetForm }) => {
			addJob({ text: values.text });
			resetForm();
		}
	});

	const isSubmiting = jobs.some((m) => m.id === 0);

	return (
		<div className="job-form">
			<h2>Write a job</h2>
			<form onSubmit={formik.handleSubmit}>
				<textarea
					name="text"
					cols="30"
					rows="5"
					placeholder="Write a job"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					value={formik.values.text}
					disabled={isSubmiting}
				/>
				{formik.touched.text && formik.errors.text ? (
					<p className="error">{formik.errors.text}</p>
				) : null}
				<input
					type="submit"
					className="btn"
					value="Add Job"
					disabled={isSubmiting}
				/>
			</form>
		</div>
	);
};

const mapStateToProps = (state) => ({
	job: state.job
});

export default connect(mapStateToProps, { addJob })(JobForm);
