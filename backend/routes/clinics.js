const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createClinic,
  getClinics,
  getClinicById,
  updateClinic,
  deleteClinic,
  getClinicByHakeemId
} = require('../controllers/clinicController');

// Create clinic (hakeem only)
// POST /api/clinics
router.post('/', protect, authorize('hakeem'), createClinic);

// Get all clinics (public, can be filtered via query params)
// GET /api/clinics
router.get('/', getClinics);

// Get clinic by hakeem ID (public)
// GET /api/clinics/hakeem/:hakeemId
router.get('/hakeem/:hakeemId', getClinicByHakeemId);

// Get clinic by ID (public)
// GET /api/clinics/:clinicId
router.get('/:clinicId', getClinicById);

// Update clinic (hakeem owner only)
// PUT /api/clinics/:clinicId
router.put('/:clinicId', protect, authorize('hakeem'), updateClinic);

// Delete clinic (hakeem owner only)
// DELETE /api/clinics/:clinicId
router.delete('/:clinicId', protect, authorize('hakeem'), deleteClinic);

module.exports = router;