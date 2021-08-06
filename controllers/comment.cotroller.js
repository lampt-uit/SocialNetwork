const Comments = require('../models/comment.model');
const Posts = require('../models/post.model');

const commentController = {
	createComment: async (req, res) => {
		try {
			const { postId, content, tag, reply, postUserId } = req.body;

			const newComment = new Comments({
				user: req.user._id,
				content,
				tag,
				reply,
				postId,
				postUserId
			});

			await Posts.findOneAndUpdate(
				{ _id: postId },
				{
					$push: { comments: newComment._id }
				},
				{ new: true }
			);

			await newComment.save();

			res.json({ newComment });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	updateComment: async (req, res) => {
		try {
			const { content } = req.body;
			await Comments.findOneAndUpdate(
				{ _id: req.params.id, user: req.user._id },
				{ content }
			);

			res.json({ msg: 'Update success.' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	likeComment: async (req, res) => {
		try {
			//have been liked
			const comment = await Comments.find({
				_id: req.params.id,
				likes: req.user._id
			});
			// console.log(post);

			if (comment.length > 0)
				return res.status(400).json({ msg: 'You liked this comment.' });

			await Comments.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$push: { likes: req.user._id }
				},
				{ new: true }
			);

			res.json({ msg: 'Liked Comment' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	unLikeComment: async (req, res) => {
		try {
			//have been liked
			// const post = await Posts.find({
			// 	_id: req.params.id,
			// 	likes: req.user._id
			// });
			// // console.log(post);

			// if (!post) return res.status(400).json({ msg: 'You liked this post.' });

			await Comments.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$pull: { likes: req.user._id }
				},
				{ new: true }
			);

			res.json({ msg: 'UnLiked Comment' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	deleteComment: async (req, res) => {
		try {
			const comment = await Comments.findOneAndDelete({
				_id: req.params.id,
				$or: [{ user: req.user._id }, { postUserId: req.user._id }]
			});

			await Posts.findOneAndUpdate(
				{
					_id: comment.postId
				},
				{
					$pull: { comments: req.params.id }
				}
			);

			console.log({ msg: 'Delete success' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
};

module.exports = commentController;
