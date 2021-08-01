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
	},
	getUser: async (req, res) => {
		try {
			const user = await Users.findById(req.params.id).select('-password');
			if (!user) return res.status(400).json({ msg: 'User does not exists.' });
			res.json({ user });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	updateUser: async (req, res) => {
		try {
			const { avatar, fullname, mobile, address, story, website, gender } =
				req.body;
			if (!fullname)
				return res.status(400).json({ msg: 'Please add your full name.' });

			await Users.findOneAndUpdate(
				{ _id: req.user._id },
				{
					avatar,
					fullname,
					mobile,
					address,
					story,
					website,
					gender
				}
			);

			res.json({ msg: 'Update Success.' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
};

module.exports = userController;
