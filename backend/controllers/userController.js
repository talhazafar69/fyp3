const User = require('../models/User'); // Assuming your User model is in ../models/User.js

// @desc    Get user profile
// @route   GET /api/users/:userId
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Add authorization: ensure the logged-in user is the one requesting their profile or an admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to access this profile' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:userId
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    // Add authorization: ensure the logged-in user is updating their own profile
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; // The pre-save hook in User model will hash it
    }
    // Add other updatable fields as necessary

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      // return other relevant fields, but not the password
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user profile
// @route   DELETE /api/users/:userId
// @access  Private
const deleteUserProfile = async (req, res, next) => {
  try {
    // Add authorization: ensure the logged-in user is deleting their own profile or an admin
     if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this profile' });
    }
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne(); // or user.remove() depending on mongoose version and hooks
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};