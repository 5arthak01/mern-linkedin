const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

var secretOrKey = process.env.JWT_SECRET;

// JWT strategy
const jwtLogin = new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
		secretOrKey
	},
	async (payload, done) => {
		try {
			const user = await User.findById(payload.id);

			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		} catch (err) {
			done(err, false);
		}
	}
);

passport.use(jwtLogin);
