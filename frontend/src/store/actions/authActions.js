import axios from 'axios';
import { SERVER_URI } from '../../constants';

import {
	LOGIN_WITH_OAUTH_LOADING,
	LOGIN_WITH_OAUTH_SUCCESS,
	LOGIN_WITH_OAUTH_FAIL,
	LOGOUT_SUCCESS,
	LOGIN_WITH_EMAIL_LOADING,
	LOGIN_WITH_EMAIL_SUCCESS,
	LOGIN_WITH_EMAIL_FAIL,
	ME_LOADING,
	ME_SUCCESS,
	ME_FAIL
} from '../types';

export const loadMe = () => async (dispatch, getState) => {
	dispatch({ type: ME_LOADING });

	try {
		const options = attachTokenToHeaders(getState);
		const response = await axios.get(SERVER_URI + '/api/users/me', options);

		dispatch({
			type: ME_SUCCESS,
			payload: { me: response.data.me }
		});
	} catch (err) {
		dispatch({
			type: ME_FAIL,
			payload: { error: err }
		});
	}
};

export const loginUserWithEmail = (formData, history) => async (
	dispatch,
	getState
) => {
	dispatch({ type: LOGIN_WITH_EMAIL_LOADING });
	try {
		const response = await axios.post(SERVER_URI + '/auth/login', formData);

		dispatch({
			type: LOGIN_WITH_EMAIL_SUCCESS,
			payload: { token: response.data.token, me: response.data.me }
		});

		dispatch(loadMe());
		history.push('/');
	} catch (err) {
		dispatch({
			type: LOGIN_WITH_EMAIL_FAIL,
			payload: { error: err }
		});
	}
};

export const logInUserWithOauth = (token) => async (dispatch, getState) => {
	dispatch({ type: LOGIN_WITH_OAUTH_LOADING });

	try {
		const headers = {
			'Content-Type': 'application/json',
			'x-auth-token': token
		};

		const response = await axios.get(SERVER_URI + '/api/users/me', { headers });

		dispatch({
			type: LOGIN_WITH_OAUTH_SUCCESS,
			payload: { me: response.data.me, token }
		});
	} catch (err) {
		dispatch({
			type: LOGIN_WITH_OAUTH_FAIL,
			payload: { error: err }
		});
	}
};

// Log user out
export const logOutUser = (history) => async (dispatch) => {
	try {
		//delete all cookies
		var cookies = document.cookie.split(';');

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf('=');
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}

		//just to log user out on the server
		await axios.get(SERVER_URI + '/auth/logout');

		dispatch({
			type: LOGOUT_SUCCESS
		});
		if (history) history.push('/');
	} catch (err) {}
};

export const attachTokenToHeaders = (getState) => {
	const token = getState().auth.token;

	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};

	if (token) {
		config.headers['x-auth-token'] = token;
	}

	return config;
};
