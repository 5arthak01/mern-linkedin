const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const JobSchema = new Schema(
	{
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
		recruiterId: {
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
			max: 5
		},
		applicants: {
			type: [String]
		},
		rejected: {
			type: [String]
		},
		accepted: {
			type: [String]
		},
		shortlisted: {
			type: [String]
		}
	},
	{
		timestamps: true
	}
);

JobSchema.methods.toJSON = function () {
	return {
		id: this._id,
		title: this.title,
		recruiterName: this.recruiterName,
		recruiterEmail: this.recruiterEmail,
		recruiterId: this.recruiterId,
		maxApplications: this.maxApplications,
		maxPositions: this.maxPositions,
		creationDate: this.creationDate,
		deadline: this.deadline,
		requiredSkills: this.requiredSkills,
		jobType: this.jobType,
		duration: this.duration,
		salary: this.salary,
		rating: this.rating,
		applicants: this.applicants,
		rejected: this.rejected,
		accepted: this.accepted,
		shortlisted: this.accepted,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt
	};
};

JobSchema.methods.createJob = (newJob, callback) => {
	newJob.save(callback);
};

const Job = mongoose.model('Jobs', JobSchema);
module.exports.Job = Job;

// Utilility function for schema validation
const validateJob = (job) => {
	const schema = {
		title: Joi.string().max(100).required(),
		recruiterName: Joi.string().required(),
		recruiterEmail: Joi.string().required(),
		recruiterId: Joi.string().required(),
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
		rating: Joi.number().min(0).max(5).optional(),
		applicants: Joi.array().items(Joi.string()).optional(),
		rejected: Joi.array().items(Joi.string()).optional(),
		accepted: Joi.array().items(Joi.string()).optional(),
		shortlisted: Joi.array().items(Joi.string()).optional()
	};

	return Joi.validate(job, schema);
};
module.exports.validateJob = validateJob;

// Now the SOP schema

const SOPSchema = new Schema({
	applicant: { type: String, required: true },
	job: { type: String, required: true },
	SOP: { type: String, required: true, maxlength: 250 }
});

SOPSchema.methods.createSOP = (newSOP, callback) => {
	newSOP.save(callback);
};

const validateSOP = (sop) => {
	const schema = {
		SOP: Joi.string().max(250).required(),
		job: Joi.string().required(),
		applicant: Joi.string().required()
	};
	return Joi.validate(sop, schema);
};

module.exports.validateSOP = validateSOP;
const SOP = mongoose.model('SOP', SOPSchema);
module.exports.SOP = SOP;
