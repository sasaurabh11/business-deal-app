const express = require('express');
const { sendMessage, getMessages, markAsRead } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send', authMiddleware, sendMessage);
router.get('/:dealId', authMiddleware, getMessages);
router.put('/read', authMiddleware, markAsRead);

module.exports = router;
