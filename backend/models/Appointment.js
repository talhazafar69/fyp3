const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hakeem_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String, // Format: "HH:MM"
    required: true
  },
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled'],
    default: 'booked'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to prevent double bookings
appointmentSchema.index({ hakeem_id: 1, date: 1, time: 1 }, { unique: true });

// Static method to check if a slot is available
appointmentSchema.statics.isSlotAvailable = async function(hakeem_id, date, time) {
  const appointment = await this.findOne({
    hakeem_id,
    date,
    time,
    status: { $ne: 'cancelled' } // Exclude cancelled appointments
  });
  
  return !appointment; // Return true if no appointment found (slot is available)
};

module.exports = mongoose.model('Appointment', appointmentSchema);