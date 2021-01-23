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
	CLEAR_JOB_ERROR
} from '../types';

const initialState = {
	jobs: [],
	isLoading: false,
	error: null
};

// You could have an array [{ id: 1, isLoading: false, error: null, text: "Hey" }, { id: 2, isLoading: true, error: null, text: null }]

export default function (state = initialState, { type, payload }) {
	switch (type) {
		case GET_JOBS_LOADING:
			return {
				...state,
				isLoading: true
			};
		case ADD_JOB_LOADING:
			return {
				...state,
				jobs: [
					{
						id: 0,
						text: 'Loading...',
						isLoading: true,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						user: { ...payload.me }
					},
					...state.jobs
				]
			};
		case DELETE_JOB_LOADING:
		case EDIT_JOB_LOADING:
			return {
				...state,
				jobs: state.jobs.map((m) => {
					if (m.id === payload.id) return { ...m, isLoading: true };
					return m;
				})
			};
		case GET_JOBS_SUCCESS:
			return {
				...state,
				isLoading: false,
				jobs: payload.jobs
			};
		case ADD_JOB_SUCCESS:
			return {
				...state,
				jobs: state.jobs.map((m) => {
					if (m.id === 0) return payload.job;
					return m;
				})
			};
		case DELETE_JOB_SUCCESS:
			return {
				...state,
				jobs: state.jobs.filter((m) => m.id !== payload.job.id)
			};
		case EDIT_JOB_SUCCESS:
			return {
				...state,
				jobs: state.jobs.map((m) => {
					if (m.id === payload.job.id) return payload.job;
					return m;
				})
			};
		case DELETE_JOB_FAIL:
		case EDIT_JOB_FAIL:
			return {
				...state,
				error: null,
				jobs: state.jobs.map((m) => {
					if (m.id === payload.id)
						return { ...m, isLoading: false, error: payload.error };
					return m;
				})
			};
		case GET_JOBS_FAIL:
			return {
				...state,
				isLoading: false,
				error: payload.error
			};
		case ADD_JOB_FAIL:
			return {
				...state,
				isLoading: false,
				error: payload.error,
				jobs: state.jobs.filter((m) => m.id !== 0)
			};
		case CLEAR_JOB_ERROR:
			return {
				...state,
				jobs: state.jobs.map((m) => {
					if (m.id === payload.id)
						return { ...m, isLoading: false, error: null };
					return m;
				})
			};
		default:
			return state;
	}
}
