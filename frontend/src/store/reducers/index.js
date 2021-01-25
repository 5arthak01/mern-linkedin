import { combineReducers } from 'redux';

import authReducer from './authReducer';
import registerReducer from './registerReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import jobReducer from './jobReducer';

export default combineReducers({
	auth: authReducer,
	register: registerReducer,
	user: userReducer,
	users: usersReducer,
	job: jobReducer
});
