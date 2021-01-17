import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import Navbar from '../components/Navbar/Navbar';

const Layout = ({ children }) => {
	return (
		<>
			<Navbar />
			<br />
			<Container>{children}</Container>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired
};

export default Layout;
