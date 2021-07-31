const jwt = require('jsonwebtoken');

const Users = require('../models/user.model');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization');
		if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' });

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		if (!decoded)
			return res.status(400).json({ msg: 'Invalid Authentication.' });

		// const user = Users.findById(decoded.id);
		const user = await Users.findOne({ _id: decoded.id });

		req.user = user;
		// console.log(req.user);
		next();
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

module.exports = auth;
