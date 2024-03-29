const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');

// google strategy
const googleLogin = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: `${process.env.SERVER_URL}${process.env.GOOGLE_CALLBACK_URL}`,
		proxy: true
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			const oldUser = await User.findOne({ email: profile.email });

			if (oldUser) {
				return done(null, oldUser);
			}
		} catch (err) {
			console.log(err);
		}

		try {
			const newUser = await new User({
				provider: 'google',
				googleId: profile.id,
				username: `user${profile.id}`,
				email: profile.email,
				name: profile.displayName,
				avatar: profile.picture
			}).save();
			done(null, newUser);
		} catch (err) {
			console.log(err);
		}
	}
);

passport.use(googleLogin);
