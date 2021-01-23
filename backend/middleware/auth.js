/**** 
DEPRECATED 
****/

// User authentication by jwt token
const jwt = require('jsonwebtoken');

function auth(res, req, next) {
	try {
		// const token = req.header('x-auth-token');
		const token = req.req.headers['x-auth-token'];

		// check for token
		if (!token) {
			return res.res
				.status(401)
				.json({ msg: 'No token, authorisation failed' });
		}

		// verify token
		try {
			var decoded_token = jwt.verify(token, process.env.JWT_SECRET);
			if (!decoded_token) {
				return res.res.status(401).json({ msg: 'Authorisation failed' });
			}
		} catch (e) {
			return res.res.status(400).json({ msg: 'Not a valid token' });
		}

		// req.user = decoded_token
		req.req.user = decoded_token;
		next();
	} catch (error) {
		console.log(error);
		return res.res.status(400).json({ msg: 'Invalid token' });
	}
}

module.exports = auth;
