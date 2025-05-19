const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Clinic = require('../models/Clinic'); // If needed for hakeem availability

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
const createAppointment = async (req, res, next) => {
  try {
    const { hakeem_id, date, time } = req.body;
    const patient_id = req.user.id; // Assuming req.user is populated by auth middleware

    if (!hakeem_id || !date || !time) {
      return res.status(400).json({ message: 'Hakeem ID, date, and time are required.' });
    }

    // Check if the hakeem exists
    const hakeem = await User.findById(hakeem_id);
    if (!hakeem || hakeem.role !== 'hakeem') {
        return res.status(404).json({ message: 'Hakeem not found.' });
    }

    // Check if the slot is available (using the static method in Appointment model)
    const isAvailable = await Appointment.isSlotAvailable(hakeem_id, new Date(date), time);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Selected time slot is not available.' });
    }

    const appointment = new Appointment({
      patient_id,
      hakeem_id,
      date: new Date(date),
      time,
      status: 'booked',
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    // Handle potential unique index violation (double booking)
    if (error.code === 11000) {
        return res.status(400).json({ message: 'This time slot was just booked. Please select another.' });
    }
    next(error);
  }
};

// @desc    Get appointments (role-aware)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patient_id = req.user.id;
    } else if (req.user.role === 'hakeem') {
      query.hakeem_id = req.user.id;
    } else {
        return res.status(403).json({ message: 'Not authorized to view appointments.' });
    }

    const appointments = await Appointment.find(query)
      .populate('patient_id', 'name email')
      .populate('hakeem_id', 'name email specialty'); // Add more fields as needed
      
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:appointmentId
// @access  Private (Hakeem only for 'completed', 'cancelled' by Hakeem)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Authorization: Only Hakeem of the appointment can update status
    if (appointment.hakeem_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this appointment' });
    }

    if (!['completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Can only be "completed" or "cancelled".' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   DELETE /api/appointments/:appointmentId
// @access  Private (Patient or Hakeem of the appointment)
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Authorization: Patient who booked or Hakeem of the appointment can cancel
    const isPatientOwner = appointment.patient_id.toString() === req.user.id;
    const isHakeemOwner = appointment.hakeem_id.toString() === req.user.id;

    if (!isPatientOwner && !isHakeemOwner) {
      return res.status(401).json({ message: 'User not authorized to cancel this appointment' });
    }
    
    if (appointment.status === 'completed') {
        return res.status(400).json({ message: 'Cannot cancel a completed appointment.' });
    }
    if (appointment.status === 'cancelled') {
        return res.status(400).json({ message: 'Appointment is already cancelled.' });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    // Instead of deleting, we mark as cancelled to keep a record.
    // If actual deletion is required: await appointment.deleteOne();
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};