
const chatController = require('../controller/ChatController');

const auth = require('../middlewares/auth');

const router = require('express').Router();

router.post('/initial-chat/:id', auth, chatController.initialChat);
router.get('/get-chat/:id', auth, chatController.getMyChat);
router.get('/initial-chat', auth, chatController.getInitialChat);

module.exports = router