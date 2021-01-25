import axios from 'axios';
import { SERVER_URI } from '../../constants';
import { attachTokenToHeaders } from './authActions';
import {
	GET_JOBS_LOADING,
	GET_JOBS_SUCCESS,
	GET_JOBS_FAIL,
	ADD_JOB_LOADING,
	ADD_JOB_SUCCESS,
	ADD_JOB_FAIL,
	DELETE_JOB_LOADING,
	DELETE_JOB_SUCCESS,
	DELETE_JOB_FAIL,
	EDIT_JOB_LOADING,
	EDIT_JOB_SUCCESS,
	EDIT_JOB_FAIL,
	CLEAR_JOB_ERROR,
	APPLY_JOB_LOADING,
	APPLY_JOB_SUCCESS,
	APPLY_JOB_FAIL,
	FILTER_JOBS_FAIL,
	FILTER_JOBS_LOADING,
	FILTER_JOBS_SUCCESS
} from '../types';

export const getJobs = () => async (dispatch, getState) => {
	dispatch({
		type: GET_JOBS_LOADING
	});
	try {
		const options = attachTokenToHeaders(getState);
		const response = await axios.get(SERVER_URI + '/api/jobs', options);

		dispatch({
			type: GET_JOBS_SUCCESS,
			payload: { jobs: response.data.jobs }
		});
	} catch (err) {
		dispatch({
			type: GET_JOBS_FAIL,
			payload: { error: err?.response?.data.job || err.job }
		});
	}
};

export const filterJobs = (formData) => async (dispatch, getState) => {
	dispatch({
		type: FILTER_JOBS_LOADING
	});
	try {
		const options = attachTokenToHeaders(getState);
		const payload = { formData };
		const response = await axios.post(
			SERVER_URI + '/api/jobs/filter',
			payload,
			options
		);

		dispatch({
			type: FILTER_JOBS_SUCCESS,
			payload: { jobs: response.data.jobs }
		});
	} catch (err) {
		console.log(err);
		dispatch({
			type: FILTER_JOBS_FAIL,
			payload: { error: err?.response?.data.job || err.job }
		});
	}
};

export const applyJob = (jobId, userId, SOP, userName, history) => async (
	dispatch,
	getState
) => {
	dispatch({
		type: APPLY_JOB_LOADING
	});
	try {
		const payload = { jobId, userId, SOP };
		const options = attachTokenToHeaders(getState);
		const response = await axios.post(
			`${SERVER_URI}/api/jobs/apply`,
			payload,
			options
		);
		dispatch({
			type: APPLY_JOB_SUCCESS
		});
		history.push(`/${userName}`);
	} catch (err) {
		console.log(err);
		dispatch({
			type: APPLY_JOB_FAIL,
			payload: { error: err?.response?.data.job || err.job, jobId, userId }
		});
	}
};

export const addJob = (formData) => async (dispatch, getState) => {
	dispatch({
		type: ADD_JOB_LOADING,
		payload: { me: { ...getState().auth.me } }
	});
	try {
		const options = attachTokenToHeaders(getState);
		const response = await axios.post(
			SERVER_URI + '/api/jobs',
			formData,
			options
		);

		dispatch({
			type: ADD_JOB_SUCCESS,
			payload: { job: response.data.job }
		});
	} catch (err) {
		dispatch({
			type: ADD_JOB_FAIL,
			payload: { error: err?.response?.data.job || err.job }
		});
	}
};

export const deleteJob = (id) => async (dispatch, getState) => {
	dispatch({
		type: DELETE_JOB_LOADING,
		payload: { id }
	});
	try {
		const options = attachTokenToHeaders(getState);
		const response = await axios.delete(
			`${SERVER_URI}/api/jobs/${id}`,
			options
		);

		dispatch({
			type: DELETE_JOB_SUCCESS,
			payload: { job: response.data.job }
		});
	} catch (err) {
		dispatch({
			type: DELETE_JOB_FAIL,
			payload: { error: err?.response?.data.job || err.job }
		});
	}
};

export const editJob = (id, formData) => async (dispatch, getState) => {
	dispatch({
		type: EDIT_JOB_LOADING,
		payload: { id }
	});
	try {
		const options = attachTokenToHeaders(getState);
		const response = await axios.put(
			`${SERVER_URI}/api/jobs/${id}`,
			formData,
			options
		);

		dispatch({
			type: EDIT_JOB_SUCCESS,
			payload: { job: response.data.job }
		});
	} catch (err) {
		dispatch({
			type: EDIT_JOB_FAIL,
			payload: { error: err?.response?.data.job || err.job, id }
		});
	}
};

export const clearJobError = (id) => ({
	type: CLEAR_JOB_ERROR,
	payload: { id }
});
