const router = require('express').Router();

const notifyController = require('../controllers/notify.controller');
const auth = require('../middleware/auth');

router.post('/notify', auth, notifyController.createNotify);
router.delete('/notify/:id', auth, notifyController.removeNotify);
router.get('/notifies', auth, notifyController.getNotifies);
router.patch('/isReadNotify/:id', auth, notifyController.isReadNotify);
router.delete('/deleteAllNotify', auth, notifyController.deleteAllNotifies);

module.exports = router;
