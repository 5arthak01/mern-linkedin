require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Load User model
const User = require('../models/Users');

// GET /user
// @desc Getting all the users
// @access public
router.get('/', function (req, res) {
	User.find(function (error, users) {
		if (error) {
			console.log(error);
		} else {
			res.json(users);
		}
	}).select('-password');
});

// GET /user/get_user
// @desc Get user data from jwt token
// @access private
router.get('/get_user', auth, (req, res) => {
	User.findById(req.user) // may have to use req.user.id
		.select('-password')
		.then((user) => {
			return res.status(200).json(user);
		})
		.catch((error) => {
			console.log(error);
			return res
				.status(400)
				.json({ msg: 'User not found or an error occured' });
		});
});

// POST /user/register
// @desc Add a user to database
// @access public
router.post('/register', (req, res) => {
	const { name, email, password, date } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ msg: 'Enter all fields' });
	}

	// Check if user already exists
	User.findOne({ email }).then((user) => {
		if (user) {
			return res.status(400).json({
				msg: 'Email already in use'
			});
		}
	});

	const newUser = new User({ name, email, password, date });

	bcrypt.genSalt(10, (error, salt) => {
		bcrypt.hash(password, salt, (error, hash) => {
			if (error) throw error;
			// hash password
			newUser.password = hash;

			// Add user in DB
			newUser
				.save()
				.then((user) => {
					jwt.sign(user.id, process.env.JWTSecret, (error, token) => {
						if (error) throw error;
						return res.status(200).json({
							token,
							user: {
								id: user.id,
								name: user.name,
								email: user.email
							}
						});
					});
				})
				.catch((error) => {
					return res.status(400).send(error);
				});
		});
	});
});

// POST /user/login
// @desc Login with user email and password
// @access public
router.post('/login', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ msg: 'Enter all fields' });
	}

	// Find user by email
	User.findOne({ email }).then((user) => {
		// Check if user exists
		if (!user) {
			return res.status(400).json({
				error: 'User not found'
			});
		}

		// Confirm password
		bcrypt
			.compare(password, user.password)
			.then((isMatch) => {
				if (!isMatch) {
					return res.status(400).json({ error: 'Invalid credentials' });
				} else {
					jwt.sign(user.id, process.env.JWTSecret, (error, token) => {
						if (error) throw error;
						res.status(200).json({
							token,
							user: {
								id: user.id,
								name: user.name,
								email: user.email
							}
						});
					});
				}
			})
			.catch((error) => {
				res.status(400).json(error);
			});
	});
});

module.exports = router;
