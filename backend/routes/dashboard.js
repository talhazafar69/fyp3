const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getHakeemDashboard } = require('../controllers/dashboardController');

// Get hakeem dashboard data
router.get('/', protect, authorize('hakeem'), getHakeemDashboard);

module.exports = router;