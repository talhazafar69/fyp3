const express = require('express');
const router = express.Router();
const {
  getHerbalMedicines,
  getHerbalMedicineById,
  searchHerbalMedicines
} = require('../controllers/herbalMedicineController');

// @route   GET /api/herbal-medicines
// @desc    Get all herbal medicines
// @access  Public
router.get('/', getHerbalMedicines);

// @route   GET /api/herbal-medicines/search
// @desc    Search herbal medicines by symptoms or name
// @access  Public
router.get('/search', searchHerbalMedicines);

// @route   GET /api/herbal-medicines/:id
// @desc    Get herbal medicine by ID
// @access  Public
router.get('/:id', getHerbalMedicineById);

module.exports = router;