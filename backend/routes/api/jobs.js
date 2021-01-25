const router = require('express').Router();
const requireJwtAuth = require('../../middleware/requireJwtAuth');
const { SOP, Job, validateJob, validateSOP } = require('../../models/Job');
const { User } = require('../../models/User');

router.get('/', async (req, res) => {
	try {
		const jobs = await Job.find().sort({ createdAt: 'desc' });

		res.json({
			jobs: jobs.map((job) => {
				return job.toJSON();
			})
		});
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ message: 'Job not found.' });
		res.json({ job: job.toJSON() });
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.post('/', requireJwtAuth, async (req, res) => {
	if (!req.body.recruiterId) {
		return res.status(400).json({
			message:
				'Please provide key "recruiterId" with the unique ID of Recruiter as value'
		});
	}

	let recruiter = await User.findById(req.body.recruiterId);
	if (!recruiter) {
		return res.status(404).json({ message: 'Recuiter not found.' });
	} else if (recruiter.role != 'recruiter') {
		return res
			.status(401)
			.json({ message: 'Only recruiters may create jobs.' });
	}
	if (
		req.body.recruiterName &&
		req.body.recruiterEmail &&
		(req.body.recruiterName != recruiter.name ||
			req.body.recruiterEmail != recruiter.email)
	) {
		return res
			.status(400)
			.json({ messsage: 'Discrepancy in Recruiter details' });
	}

	let newJob = Job({
		...req.body,
		recruiterName: recruiter.name,
		recruiterEmail: recruiter.email
	});
	if (req.body.recruiterName && req.body.recruiterEmail) {
		newJob = Job({ ...req.body });
	}

	const { error } = validateJob(newJob);
	if (error) return res.status(400).json({ message: error.details[0].message });

	try {
		newJob.createJob(newJob, (err, job) => {
			if (err) throw err;
			return res
				.status(200)
				.json({ message: 'Registration successful.', job: newJob.toJSON() });
		});
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.post('/apply', requireJwtAuth, async (req, res) => {
	try {
		// Ensure valid job and user
		if (!req.body.jobId || !req.body.userId) {
			return res.status(400).json({
				message: 'Job and recruiter details necessary'
			});
		}
		const job = await Job.findById(req.body.jobId);
		if (!job) {
			return res.status(400).json({
				message: 'No such job'
			});
		}

		const applicant = await User.findById(req.body.userId);
		if (!applicant) {
			return res.status(400).json({
				message: 'Applicant not found'
			});
		}
		if (applicant.role == 'recruiter') {
			return res.status(400).json({
				message: 'Recruiters can not be an applicant '
			});
		}
		if (!(applicant.id === req.user.id)) {
			return res
				.status(401)
				.json({ message: 'You cannot apply on behalf of others' });
		}

		// Ensure job can be applied to and the applicant can apply to jobs
		if (job.maxApplications == job.applicants.length) {
			return res.status(400).json({
				message: 'Number of maximum applicants for this job has been reached'
			});
		}
		if (applicant.jobs.length === 10 || applicant.selected) {
			return res.status(400).json({
				message: 'This user is not allowed to apply for jobs'
			});
		}
		if (applicant.jobs.includes(job.id)) {
			return res.status(400).json({
				message: 'You have already applied for this job'
			});
		}

		// Create SOP document
		const { error } = validateSOP({
			applicant: applicant.id,
			job: job.id,
			SOP: req.body.SOP
		});
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		let newSOP = SOP({
			applicant: applicant.id,
			job: job.id,
			SOP: req.body.SOP
		});
		newSOP.createSOP(newSOP, (err, SOP) => {
			if (err) throw err;
		});

		// Update job with new applicant
		job.applicants = [...job.applicants, applicant.id];
		job.markModified('applicants');
		await job.save();

		// Update applicant data
		applicant.jobs = [...applicant.jobs, job.id];
		applicant.markModified('jobs');
		await applicant.save();

		return res.status(201);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
	try {
		const tempJob = await Job.findById(req.params.id).populate('user');
		if (!tempJob.user.id === req.user.id)
			return res.status(400).json({ message: 'Not the job owner or admin.' });

		const job = await Job.findByIdAndRemove(req.params.id).populate('user');
		if (!job) return res.status(404).json({ message: 'No job found.' });
		res.status(200).json({ job });
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.put('/:id', requireJwtAuth, async (req, res) => {
	const { error } = validateJob(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	try {
		const tempJob = await Job.findById(req.params.id).populate('user');
		if (!(tempJob.user.id === req.user.id || req.user.role === 'ADMIN'))
			return res.status(400).json({ message: 'Not the job owner or admin.' });

		let job = await Job.findByIdAndUpdate(
			req.params.id,
			{ text: req.body.text, user: tempJob.user.id },
			{ new: true }
		);
		if (!job) return res.status(404).json({ message: 'No job found.' });
		job = await job.populate('user').execPopulate();

		res.status(200).json({ job });
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

module.exports = router;
