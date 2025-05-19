const ChatLog = require('../models/ChatLog');

// @desc    Process a chatbot message
// @route   POST /api/chatbot
// @access  Private (patient only)
const processMessage = async (req, res, next) => {
  try {
    const { message, chatId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }
    
    // In a real application, you would process the message here
    // For now, we'll return a placeholder response
    const botResponse = {
      response: `I received your message: "${message}". This is a placeholder response.`
    };
    
    res.status(200).json(botResponse);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save chat history
// @route   POST /api/chatbot/history
// @access  Private
const saveChatHistory = async (req, res, next) => {
  try {
    const { id, title, date, messages } = req.body;
    
    if (!id || !messages || !messages.length) {
      return res.status(400).json({ message: 'Please provide chat ID and messages' });
    }
    
    // Check if chat history already exists
    let chatHistory = await ChatLog.findOne({ 
      user_id: req.user.id,
      chat_id: id
    });
    
    if (chatHistory) {
      // Update existing chat history
      chatHistory.title = title;
      chatHistory.messages = messages;
      chatHistory.updated_at = Date.now();
      await chatHistory.save();
    } else {
      // Create new chat history
      chatHistory = await ChatLog.create({
        user_id: req.user.id,
        chat_id: id,
        title,
        messages,
        created_at: date,
        updated_at: Date.now()
      });
    }
    
    res.status(200).json({ success: true, chatHistory });
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get chat history
// @route   GET /api/chatbot/history
// @access  Private
const getChatHistory = async (req, res, next) => {
  try {
    const chatHistory = await ChatLog.find({ user_id: req.user.id })
      .sort({ updated_at: -1 })
      .select('chat_id title messages created_at updated_at');
    
    // Format the response to match frontend expectations
    const formattedHistory = chatHistory.map(chat => ({
      id: chat.chat_id,
      title: chat.title,
      date: chat.created_at,
      messages: chat.messages
    }));
    
    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  processMessage,
  saveChatHistory,
  getChatHistory
};