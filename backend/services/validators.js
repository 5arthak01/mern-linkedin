const Joi = require('joi');

const loginSchema = Joi.object().keys({
	email: Joi.string().trim().email().required(),
	password: Joi.string().trim().min(6).max(20).required()
});

const registerSchema = Joi.object().keys({
	name: Joi.string().trim().min(2).max(30).required(),
	username: Joi.string()
		.trim()
		.min(2)
		.max(20)
		.regex(/^[a-zA-Z0-9_]+$/)
		.required(),
	email: Joi.string().trim().email().required(),
	password: Joi.string().trim().min(6).max(20).required()
});

const applicantSchema = Joi.object().keys({
	name: Joi.string().min(2).max(30).required(),
	username: Joi.string()
		.min(2)
		.max(20)
		.regex(/^[a-zA-Z0-9_]+$/)
		.required(),
	email: Joi.string().trim().email().required(),
	password: Joi.string().trim().min(6).max(20).required(),
	education: Joi.array()
		.items(
			Joi.object().keys({
				institute: Joi.string().max(200).required(),
				startYear: Joi.number().min(1900).max(2021).required()
			})
		)
		.required(),
	skills: Joi.array().items(Joi.string()).required(),
	role: Joi.string().valid('applicant')
});

const recruiterSchema = Joi.object().keys({
	email: Joi.string().trim().email().required(),
	name: Joi.string().min(2).max(30).required(),
	username: Joi.string()
		.min(2)
		.max(20)
		.regex(/^[a-zA-Z0-9_]+$/)
		.required(),
	password: Joi.string().trim().min(6).max(20).required(),
	bio: Joi.string().max(250).allow(''),
	role: Joi.string().valid('recruiter')
});

module.exports.loginSchema = loginSchema;
module.exports.recruiterSchema = recruiterSchema;
module.exports.applicantSchema = applicantSchema;
module.exports.registerSchema = registerSchema;
