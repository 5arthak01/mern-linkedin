const Joi = require('joi');
const User = require('../../models/User');
const requireLocalAuth = require('../../middleware/requireLocalAuth');
const {
	registerSchema,
	applicantSchema,
	recruiterSchema
} = require('../../services/validators');

const router = require('express').Router();

router.post('/login', requireLocalAuth, (req, res) => {
	const token = req.user.generateJWT();
	const me = req.user.toJSON();
	res.json({ token, me });
});

router.post('/register', async (req, res, next) => {
	if (req.body.role == 'applicant') {
		let { error } = Joi.validate(req.body, applicantSchema);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}
	} else if (req.body.role == 'recruiter') {
		let { error } = Joi.validate(req.body, recruiterSchema);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}
	} else {
		return res.status(400).send({
			message:
				"An 'applicant' or 'recruiter' role is necessary for registration"
		});
	}

	const {
		email,
		password,
		name,
		username,
		role,
		education,
		skills,
		rating,
		bio,
		registrationDate
	} = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).send({ message: 'Email is already in use' });
		}

		try {
			var newUser = '';
			switch (role) {
				case 'applicant':
					newUser = User({
						provider: 'email',
						email,
						password,
						username,
						name,
						role,
						avatar: `${process.env.IMAGES_FOLDER_PATH}avatar0.jpg`,
						education,
						skills,
						rating
					});
				case 'recruiter':
					newUser = User({
						provider: 'email',
						email,
						password,
						username,
						name,
						role,
						avatar: `${process.env.IMAGES_FOLDER_PATH}avatar0.jpg`,
						bio,
						registrationDate
					});
			}

			newUser.registerUser(newUser, (err, user) => {
				if (err) throw err;
				res.status(200).json({ message: 'Registration successful.', newUser }); // just redirect to login
			});
		} catch (err) {
			return next(err);
		}
	} catch (err) {
		return next(err);
	}
});

// logout
router.get('/logout', (req, res) => {
	req.logout();
	res.send(false);
});

module.exports = router;
