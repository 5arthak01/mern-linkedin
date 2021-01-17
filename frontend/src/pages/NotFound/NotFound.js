import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import Layout from '../../layout/Layout';

const NotFound = () => {
	return (
		<Layout>
			<Container style={{ textAlign: 'center' }}>
				<h1>Not Found 404</h1>
				<p>
					Go back to{' '}
					<Link className="bold" to="/">
						Home
					</Link>
				</p>
			</Container>
		</Layout>
	);
};

export default NotFound;
