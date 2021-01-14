const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RecruiterSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	registration_date: {
		type: Date,
		default: Date.now
	}
});

module.exports = User = mongoose.model('Recruiters', RecruiterSchema);