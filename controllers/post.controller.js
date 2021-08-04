const Posts = require('../models/post.model');

const postController = {
	createPost: async (req, res) => {
		try {
			const { content, images } = req.body;

			if (images.length === 0)
				return res.status(400).json({ msg: 'Please add your photo.' });
			const newPost = new Posts({ content, images, user: req.user._id });

			await newPost.save();

			res.json({
				msg: 'Create post success.',
				newPost
			});
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	getPosts: async (req, res) => {
		try {
			//Get POST myself or post's have been following
			const posts = await Posts.find({
				user: [...req.user.following, req.user._id]
			})
				.sort('-createdAt')
				.populate('user likes', 'avatar username fullname');

			res.json({
				msg: 'Success',
				result: posts.length,
				posts
			});
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	updatePost: async (req, res) => {
		try {
			const { content, images } = req.body;

			const post = await Posts.findOneAndUpdate(
				{ _id: req.params.id },
				{
					content,
					images
				}
			).populate('user likes', 'avatar username fullname');

			res.json({
				msg: 'Updated Post',
				newPost: {
					...post._doc,
					content,
					images
				}
			});
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	likePost: async (req, res) => {
		try {
			//have been liked
			const post = await Posts.find({
				_id: req.params.id,
				likes: req.user._id
			});
			// console.log(post);

			if (post.length > 0)
				return res.status(400).json({ msg: 'You liked this post.' });

			await Posts.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$push: { likes: req.user._id }
				},
				{ new: true }
			);

			res.json({ msg: 'Liked Post' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	},
	unLikePost: async (req, res) => {
		try {
			//have been liked
			// const post = await Posts.find({
			// 	_id: req.params.id,
			// 	likes: req.user._id
			// });
			// // console.log(post);

			// if (!post) return res.status(400).json({ msg: 'You liked this post.' });

			await Posts.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$pull: { likes: req.user._id }
				},
				{ new: true }
			);

			res.json({ msg: 'UnLiked Post' });
		} catch (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
};

module.exports = postController;
