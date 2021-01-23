const requireJwtAuth = require('../../middleware/requireJwtAuth');
const { Job, validateJob } = require('../../models/Job');
const router = require('express').Router();

router.get('/', async (req, res) => {
	try {
		const jobs = await Job.find().sort({ createdAt: 'desc' }).populate('user');

		res.json({
			jobs: jobs.map((m) => {
				return m.toJSON();
			})
		});
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const job = await Job.findById(req.params.id).populate('user');
		if (!job) return res.status(404).json({ message: 'No job found.' });
		res.json({ job: job.toJSON() });
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.post('/', requireJwtAuth, async (req, res) => {
	const { error } = validateJob(req.body);
	if (error) return res.status(400).json({ job: error.details[0].job });

	try {
		let job = await Job.create({
			text: req.body.text,
			user: req.user.id
		});
		job = await job.populate('user').execPopulate();

		res.status(200).json({ job: job.toJSON() });
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.' });
	}
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
	try {
		const tempJob = await Job.findById(req.params.id).populate('user');
		if (!(tempJob.user.id === req.user.id || req.user.role === 'ADMIN'))
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
	if (error) return res.status(400).json({ job: error.details[0].job });

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
