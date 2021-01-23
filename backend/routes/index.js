const localAuthRoutes = require('./auth/localAuth');
const googleAuthRoutes = require('./auth/googleAuth');
const usersRoutes = require('./api/users');
const jobsRoutes = require('./api/jobs');
const router = require('express').Router();

// GET /api/users/me
// GET /api/users/feature
router.use('/api/users', usersRoutes);

// GET /api/jobs
router.use('/api/jobs', jobsRoutes);

// fallback 404
router.use('/api', (req, res) =>
	res.status(404).json('No route for this path')
);

// POST /auth/login
// POST /auth/register
// GET /auth/logout
router.use('/auth', localAuthRoutes);

// GET /auth/google
// GET /auth/google/callback
router.use('/auth', googleAuthRoutes);

module.exports = router;
