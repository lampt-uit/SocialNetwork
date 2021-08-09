const Notifies = require('../models/notify.model');

const notifyController = {
	createNotify: async (req, res) => {
		try {
			const { id, recipients, url, text, content, image } = req.body;

			if (recipients.includes(req.user._id.toString())) return;

			const notify = new Notifies({
				id,
				recipients,
				url,
				text,
				content,
				image,
				user: req.user._id
			});

			await notify.save();

			res.json({ notify });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	removeNotify: async (req, res) => {
		try {
			const notify = await Notifies.findOneAndDelete({
				id: req.params.id,
				url: req.query.url
			});

			return res.json({ notify });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	getNotifies: async (req, res) => {
		try {
			const notify = await Notifies.find({
				recipients: req.user._id
			})
				.sort('-createdAt')
				.populate('user', 'avatar username');

			return res.json({ notify });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
};

module.exports = notifyController;
