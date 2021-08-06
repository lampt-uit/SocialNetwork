const Comments = require('../models/comment.model');
const Posts = require('../models/post.model');

const commentController = {
	createComment: async (req, res) => {
		try {
			const { postId, content, tag, reply } = req.body;
			console.log({ postId, content, tag, reply });

			const newComment = new Comments({
				user: req.user._id,
				content,
				tag,
				reply
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
	}
};

module.exports = commentController;