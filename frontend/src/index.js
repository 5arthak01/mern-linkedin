import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route path="/" component={App} />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
);
