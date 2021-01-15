const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
	title: {
		type: String,
		required: true,
		maxlength: 100
	},
	recruiter_name: {
		type: String,
		required: true
	},
	recruiter_email: {
		type: String,
		required: true
	},
	max_applications: {
		type: Number,
		required: true
	},
	max_positions: {
		type: Number,
		required: true
	},
	creation_date: {
		type: Date,
		default: Date.now
	},
	deadline: {
		type: Date,
		required: true
	},
	required_skills: {
		type: [String],
		required: true
	},
	job_type: {
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
	}
});

module.exports = Job = mongoose.model('Jobs', JobSchema);
