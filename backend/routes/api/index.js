const usersRoutes = require('./users');
const router = require('express').Router();

router.use('/users', usersRoutes);

module.exports = router;
