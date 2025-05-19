const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Get current user route (protected)
router.get('/me', protect, getMe);

module.exports = router;