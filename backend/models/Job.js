const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const JobSchema = new Schema({
	title: {
		type: String,
		required: true,
		maxlength: 100
	},
	recruiterName: {
		type: String,
		required: true
	},
	recruiterEmail: {
		type: String,
		required: true
	},
	maxApplications: {
		type: Number,
		required: true
	},
	maxPositions: {
		type: Number,
		required: true
	},
	creationDate: {
		type: Date,
		default: Date.now
	},
	deadline: {
		type: Date,
		required: true
	},
	requiredSkills: {
		type: [String],
		required: true
	},
	jobType: {
		type: String,
		enum: ['Full-time', 'Part-time', 'Work-from-home'],
		required: true
	},
	duration: {
		type: Number,
		min: 0,
		max: 6,
		required: true
	},
	salary: {
		type: Number,
		required: true,
		min: 0,
		max: 100000000000000
	},
	rating: {
		type: Number,
		min: 0,
		max: 5,
		required: true
	},
	applicants: {
		type: [String]
	}
});

JobSchema.methods.toJSON = function () {
	return {
		id: this._id,
		title: this.title,
		recruiterName: this.recruiterName,
		recruiterEmail: this.recruiterEmail,
		maxApplications: this.maxApplications,
		maxPositions: this.maxPositions,
		creationDate: this.creationDate,
		deadline: this.deadline,
		requiredSkills: this.requiredSkills,
		jobType: this.jobType,
		duration: this.duration,
		salary: this.salary,
		rating: this.rating,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
		applicants: this.applicants
	};
};

validateJob = (job) => {
	const schema = {
		title: Joi.string().max(100).required(),
		recruiterName: Joi.string().required(),
		recruiterEmail: Joi.string().required(),
		maxApplications: Joi.number().required(),
		maxPositions: Joi.number().required(),
		creationDate: Joi.date(),
		deadline: Joi.date(),
		requiredSkills: Joi.array().items(Joi.string()).required(),
		jobType: Joi.string()
			.valid('Full-time', 'Part-time', 'Work-from-home')
			.required(),
		duration: Joi.number().min(0).max(6).required(),
		salary: Joi.number().min(0).max(100000000000000).required(),
		rating: Joi.number().min(0).max(5).required(),
		applicants: Joi.array().items(Joi.string())
	};

	return Joi.validate(message, schema);
};
module.exports.validateJob = validateJob;

module.exports = Job = mongoose.model('Jobs', JobSchema);
