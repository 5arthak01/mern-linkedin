import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
	Collapse,
	Navbar as Navbarstrap,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	NavbarText
} from 'reactstrap';

import { logOutUser } from '../../store/actions/authActions';

const Navbar = ({ auth, logOutUser, history }) => {
	const onLogOut = (event) => {
		event.preventDefault();
		logOutUser(history);
	};

	// for reactstrap
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	return (
		<Navbarstrap className="navbar-dark bg-dark navbar-expand-md">
			<NavbarBrand>Linkedin't</NavbarBrand>
			<NavbarToggler onClick={toggle} />

			<Collapse isOpen={isOpen} navbar>
				<Nav className="mr-auto" navbar>
						<NavItem>
							<NavLink href="/">Home</NavLink>
            			</NavItem>
						{auth.isAuthenticated ? (
							<>
								<NavItem>
						  	  		<NavLink href="/users">Users</NavLink>
                				</NavItem>
                				<NavItem>
						  	  		<NavLink href={`/${auth.me.username}`}>Profile</NavLink>
                				</NavItem>
                				<NavItem>
								  	<img className="avatar" alt="avatar" src={auth.me.avatar} />
                				</NavItem>
                				<NavItem>
									<NavbarText><a href="#" onClick={onLogOut}>Log out</a></NavbarText>
                				</NavItem>
							</>
						) : (
							<>
								<NavItem>
							  	  <NavLink href="/login">Login</NavLink>
                				</NavItem>
							</>
						)}
				</Nav>
			</Collapse>
		</Navbarstrap>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default compose(
	withRouter,
	connect(mapStateToProps, { logOutUser })
)(Navbar);
