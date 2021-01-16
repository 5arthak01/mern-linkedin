const fs = require('fs');
const join = require('path').join;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Create Schema
const UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: [true, "can't be blank"],
		match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
		index: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	avatar: String, // profile picture
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 60
	},
	registration_date: {
		type: Date,
		default: Date.now
	},
	// Email or Google, authentication provider
	provider: {
		type: String,
		required: true
	},
	googleId: {
		type: String,
		unique: true,
		sparse: true
	}
});

UserSchema.methods.toJSON = function () {
	const isValidUrl = (str) => {
		var urlRegex =
			'^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
		var url = new RegExp(urlRegex, 'i');
		return str.length < 2083 && url.test(str);
	};
	const absoluteAvatarFilePath = `${join(
		__dirname,
		'../..',
		process.env.IMAGES_FOLDER_PATH
	)}${this.avatar}`;
	const avatar = isValidUrl(this.avatar)
		? this.avatar
		: fs.existsSync(absoluteAvatarFilePath)
		? `${process.env.IMAGES_FOLDER_PATH}${this.avatar}`
		: `${process.env.IMAGES_FOLDER_PATH}avatar0.jpg`;
	// if profile picture does not exist, avatar0.jpg by default

	return {
		id: this._id,
		provider: this.provider,
		email: this.email,
		username: this.username,
		avatar: avatar,
		name: this.name
	};
};

UserSchema.methods.generateJWT = function () {
	const token = jwt.sign(
		{
			id: this._id,
			provider: this.provider,
			email: this.email
		},
		process.env.JWT_SECRET
	);
	return token;
};

// register a new user with email and password
UserSchema.methods.registerUser = (newUser, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) {
				console.log(err);
			}
			// set pasword to hash
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

// Validate a password with it's stored hash
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

async function hashPassword(password) {
	const saltRounds = 10; // default value for bcryptjs is 10

	const hashedPassword = await new Promise((resolve, reject) => {
		bcrypt.hash(password, saltRounds, function (err, hash) {
			if (err) reject(err);
			else resolve(hash);
		});
	});

	return hashedPassword;
}
module.exports.hashedPassword = hashPassword;

const validateUser = (user) => {
	const schema = {
		avatar: Joi.any(),
		name: Joi.string().min(2).max(30).required(),
		username: Joi.string()
			.min(2)
			.max(20)
			.regex(/^[a-zA-Z0-9_]+$/)
			.required(),
		password: Joi.string().min(6).max(20).allow('').allow(null)
	};

	return Joi.validate(user, schema);
};
module.exports.validateUser = validateUser;
const User = mongoose.model('Users', UserSchema);
module.exports = User;
module.exports.User = User;
