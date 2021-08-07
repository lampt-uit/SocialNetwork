const router = require('express').Router();

const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth');

router
	.route('/posts')
	.post(auth, postController.createPost)
	.get(auth, postController.getPosts);
router
	.route('/post/:id')
	.patch(auth, postController.updatePost)
	.get(auth, postController.getPost)
	.delete(auth, postController.deletePost);
router.route('/post/:id/like').patch(auth, postController.likePost);
router.route('/post/:id/unlike').patch(auth, postController.unLikePost);
router.get('/user_posts/:id', auth, postController.getUserPosts);
router.get('/post_discover', auth, postController.getPostsDiscover);

module.exports = router;
