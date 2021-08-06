const router = require('express').Router();

const auth = require('../middleware/auth');
const commentController = require('../controllers/comment.cotroller');

router.post('/comment', auth, commentController.createComment);

module.exports = router;
