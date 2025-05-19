const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Remove the automatic _id generation and allow custom id field
  _id: false, // Disable automatic _id generation
  id: {
    type: Number,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chat_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'New conversation'
  },
  messages: [messageSchema],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  // Additional metadata for the chat session
  metadata: {
    type: Map,
    of: String
  }
});

// Create a compound index for user_id and chat_id
chatLogSchema.index({ user_id: 1, chat_id: 1 }, { unique: true });

// Index for faster querying of user's chat logs
chatLogSchema.index({ user_id: 1, updated_at: -1 });

module.exports = mongoose.model('ChatLog', chatLogSchema);