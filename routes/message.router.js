const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

router.post('/message', auth, messageController.createMessage);
router.get('/conversations', auth, messageController.getConversation);
router.get('/message/:id', auth, messageController.getMessages);
router.delete('/message/:id', auth, messageController.deleteMessages);
router.delete('/conversation/:id', auth, messageController.deleteConversation);

module.exports = router;
