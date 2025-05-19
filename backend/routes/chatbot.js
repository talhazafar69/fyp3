const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { processMessage, saveChatHistory, getChatHistory } = require('../controllers/chatbotController');

// Process chatbot message
router.post('/', protect, authorize('patient'), processMessage);

// Chat history routes
router.post('/history', protect, saveChatHistory);
router.get('/history', protect, getChatHistory);

module.exports = router;