const usersRoutes = require('./users');
const jobsRoutes = requrie('./jobs');
const router = require('express').Router();

router.use('/users', usersRoutes);
router.use('/jobs', jobsRoutes);

module.exports = router;
