// Google user authentication using passport

const router = require('express').Router();
const passport = require('passport');

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email']
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/',
		session: false
	}),
	(req, res) => {
		const token = req.user.generateJWT();
		res.cookie('x-auth-cookie', token);
		res.redirect(process.env.CLIENT_URL);
	}
);

module.exports = router;
