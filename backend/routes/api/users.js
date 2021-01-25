const multer = require('multer');
const resolve = require('path').resolve;
const requireJwtAuth = require('../../middleware/requireJwtAuth');
const { User, hashPassword, validateUser } = require('../../models/User');

const router = require('express').Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, resolve(__dirname, '../../../public/images'));
	},
	filename: function (req, file, cb) {
		const fileName = file.originalname.toLowerCase().split(' ').join('-');
		cb(null, `avatar-${Date.now()}-${fileName}`);
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == 'image/png' ||
			file.mimetype == 'image/jpg' ||
			file.mimetype == 'image/jpeg'
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
		}
	}
});

// For updating user details
router.put(
	'/:id',
	[requireJwtAuth, upload.single('avatar')],
	async (req, res, next) => {
		try {
			const tempUser = await User.findById(req.params.id);
			if (!tempUser)
				return res.status(404).json({ message: 'User not found.' });
			if (!(tempUser.id === req.user.id))
				return res
					.status(401)
					.json({ message: 'You do not have privilegies to edit this user.' });

			const { error } = validateUser(req.body);
			if (error)
				return res.status(400).json({ message: error.details[0].message });

			let avatarPath = null;
			if (req.file) {
				avatarPath = req.file.filename;
			}

			let password = null;
			if (
				req.user.provider === 'email' && // don't update password if google is provider
				req.body.password &&
				req.body.password !== ''
			) {
				password = await hashPassword(req.body.password);
			}

			const existingUser = await User.findOne({ username: req.body.username });
			if (existingUser && existingUser.id !== tempUser.id) {
				return res
					.status(400)
					.json({ message: 'An account with this username already exists.' });
			}

			var updatedUser = '';
			switch (req.body.role) {
				case 'applicant':
					updatedUser = {
						avatar: avatarPath,
						name: req.body.name,
						username: req.body.username,
						password,
						role: req.body.role,
						education: req.body.education,
						skills: req.body.skills,
						rating: req.body.rating
					};
				case 'recruiter':
					updatedUser = {
						avatar: avatarPath,
						name: req.body.name,
						username: req.body.username,
						password,
						role: req.body.role,
						bio: req.body.bio,
						registrationDate: req.body.registrationDate
					};
			}
			// remove '', null, undefined
			Object.keys(updatedUser).forEach(
				(k) =>
					!updatedUser[k] &&
					updatedUser[k] !== undefined &&
					delete updatedUser[k]
			);

			const user = await User.findByIdAndUpdate(
				tempUser.id,
				{ $set: updatedUser },
				{ new: true }
			);

			res.status(200).json({ user });
		} catch (err) {
			res.status(500).json({ message: 'Something went wrong.' });
		}
	}
);

// get user details with jwt token
router.get('/me', requireJwtAuth, (req, res) => {
	const me = req.user.toJSON();
	res.json({ me });
});

// get user details with jwt token and username
router.get('/:username', requireJwtAuth, async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username });
		if (!user) return res.status(404).json({ message: 'No user found.' });
		res.json({ user: user.toJSON() });
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

// get all users
router.get('/', requireJwtAuth, async (req, res) => {
	try {
		const users = await User.find().sort({ createdAt: 'desc' });

		res.json({
			users: users.map((m) => {
				return m.toJSON();
			})
		});
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
	try {
		const tempUser = await User.findById(req.params.id);
		if (!tempUser) return res.status(404).json({ message: 'No such user.' });
		if (!(tempUser.id === req.user.id))
			return res
				.status(400)
				.json({ message: 'You do not have privilegies to delete that user.' });

		//delete user
		const user = await User.findByIdAndRemove(tempUser.id);
		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

module.exports = router;
