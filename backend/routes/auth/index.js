const localAuthRoutes = require('./localAuth');
const googleAuthRoutes = require('./googleAuth');
const apiRoutes = require('../api');
const router = require('express').Router();

// POST /auth/login
// POST /auth/register
// GET /auth/logout
router.use('/auth', localAuthRoutes);

// GET /auth/google
// GET /auth/google/callback
router.use('/auth', googleAuthRoutes);

// GET api/users/me
// GET /api/users/feature
router.use('/api', apiRoutes);

// fallback 404
router.use('/api', (req, res) =>
	res.status(404).json('No route for this path')
);

module.exports = router;
