const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');

// Book appointment (patient only)
router.post('/', protect, authorize('patient'), createAppointment);

// Get appointments (role-aware)
router.get('/', protect, getAppointments);

// Update appointment status (hakeem only)
router.put('/:appointmentId', protect, authorize('hakeem'), updateAppointmentStatus);

// Cancel appointment (patient or hakeem)
router.delete('/:appointmentId', protect, cancelAppointment);

module.exports = router;