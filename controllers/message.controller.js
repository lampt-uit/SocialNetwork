const Conversations = require('../models/conversation.model');
const Messages = require('../models/message.model');

//Pagination
class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	paginating() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 9;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		// console.log(this);
		return this;
	}
}

const messageController = {
	createMessage: async (req, res) => {
		try {
			const { recipient, text, media } = req.body;
			// console.log(recipient);

			if (!recipient || (!text.trim() && media.length === 0)) return;

			const newConversation = await Conversations.findOneAndUpdate(
				{
					$or: [
						{ recipients: [req.user._id, recipient] },
						{ recipients: [recipient, req.user._id] }
					]
				},
				{
					recipients: [req.user._id, recipient],
					text,
					media
				},
				{
					new: true,
					upsert: true
				}
			);

			const newMessage = new Messages({
				conversation: newConversation._id,
				sender: req.user._id,
				recipient,
				text,
				media
			});

			await newMessage.save();

			res.json({ msg: 'Create Success.' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	getConversation: async (req, res) => {
		try {
			//Get conversation that auth join
			const features = new APIfeatures(
				Conversations.find({
					recipients: req.user._id
				}),
				req.query
			).paginating();

			//Has been sent message with ... (quantity)
			const conversations = await features.query
				.sort('-updatedAt')
				.populate('recipients', 'avatar username fulltime');

			res.json({ conversations, result: conversations.length });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	getMessages: async (req, res) => {
		try {
			const features = new APIfeatures(
				Messages.find({
					$or: [
						{ sender: req.user._id, recipient: req.params.id },
						{ sender: req.params.id, recipient: req.user._id }
					]
				}),
				req.query
			).paginating();

			const messages = await features.query.sort('-createdAt');

			res.json({ messages, result: messages.length });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	deleteMessages: async (req, res) => {
		try {
			await Messages.findOneAndDelete({
				_id: req.params.id,
				sender: req.user._id
			});

			res.json({ msg: 'Delete Success' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
};

module.exports = messageController;
