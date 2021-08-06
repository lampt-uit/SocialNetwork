const router = require('express').Router();

const auth = require('../middleware/auth');
const commentController = require('../controllers/comment.cotroller');

router.post('/comment', auth, commentController.createComment);
router.patch('/comment/:id', auth, commentController.updateComment);
router.patch('/comment/:id/like', auth, commentController.likeComment);
router.patch('/comment/:id/unlike', auth, commentController.unLikeComment);
router.delete('/comment/:id', auth, commentController.deleteComment);

module.exports = router;
