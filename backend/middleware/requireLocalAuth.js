// User authentication for email/password option
// Refer http://www.passportjs.org/docs/authenticate/ for more

const passport = require('passport');

const requireLocalAuth = (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(400).send(json(info));
		}
		req.user = user;
		next();
	})(req, res, next);
};

module.exports = requireLocalAuth;
