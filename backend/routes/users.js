const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controller functions
const { 
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} = require('../controllers/userController'); // Ensure this path is correct and userController.js exports these

// Get current user profile
router.get('/me', protect, (req, res, next) => {
  req.params.userId = req.user.id; // Set userId param to the authenticated user's ID
  getUserProfile(req, res, next);
});

// Update current user profile
router.put('/me', protect, (req, res, next) => {
  req.params.userId = req.user.id; // Set userId param to the authenticated user's ID
  updateUserProfile(req, res, next);
});

// Get user profile by ID
router.get('/:userId', protect, getUserProfile);

// Update user profile by ID
router.put('/:userId', protect, updateUserProfile);

// Delete user profile
router.delete('/:userId', protect, deleteUserProfile);

module.exports = router;