const Users = require('../models/user.model');

const userController = {
	searchUser: async (req, res) => {
		try {
			const users = await Users.find({
				username: { $regex: req.query.username }
			})
				.limit(10)
				.select('fullname username avatar');
			res.json({ users });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
};

module.exports = userController;
