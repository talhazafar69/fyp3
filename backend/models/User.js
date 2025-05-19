const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the clinic details schema for hakeem users
const clinicDetailsSchema = new mongoose.Schema({
  location: { type: String },
  fees: { type: Number },
  specialty: { type: String },
  availability: {
    working_days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    start_time: { type: String }, // Format: "HH:MM"
    end_time: { type: String },   // Format: "HH:MM"
    slot_duration: { type: Number, default: 30 } // Duration in minutes
  }
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Don't return password in queries
  },
  role: {
    type: String,
    enum: ['patient', 'hakeem'],
    required: true
  },
  license_number: {
    type: String,
    required: function() { return this.role === 'hakeem'; } // Only required for hakeems
  },
  clinic_details: {
    type: clinicDetailsSchema,
    required: false // Will be added after hakeem registration
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);