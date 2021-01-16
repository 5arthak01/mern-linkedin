require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', function () {
	console.log('MongoDB database connection established successfully !');
});

// routes
var testAPIRouter = require('./routes/testAPI');
var UserRouter = require('./routes/User');
var authRouter = require('./routes/auth');

app.use('/', authRouter);
app.use('/testAPI', testAPIRouter);
app.use('/user', UserRouter);

// Setup passportjs authorisation
app.use(passport.initialize());
require('./services/jwtStrategy');
require('./services/googleStrategy');
require('./services/localStrategy');

app.listen(PORT, function () {
	console.log('Server is running on Port: ' + PORT);
});
