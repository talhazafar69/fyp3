const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "17:00"
  slotDuration: { type: Number, required: true, default: 30 } // in minutes
}, { _id: false });

const clinicSchema = new mongoose.Schema({
  hakeem_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true // A hakeem can only have one clinic
  },
  name: {
    type: String,
    required: [true, 'Please add a clinic name'],
    trim: true
  },
  address: { // Consider making this a nested object if more detail is needed
    street: { type: String, required: true },
    city: { type: String, required: true },
    // state: { type: String }, // Optional
    // zip_code: { type: String }, // Optional
    // country: { type: String, default: 'Your Country' } // Optional
  },
  city: { // Can be a top-level field for easier searching/filtering
    type: String,
    required: [true, 'Please add the city where the clinic is located.']
  },
  phone_number: {
    type: String,
    required: [true, 'Please add a contact phone number for the clinic.']
  },
  availability: [availabilitySchema], // Array of availability objects
  services_offered: {
    type: [String],
    default: []
  },
  fees: { // Consultation fee
    type: Number,
    required: [true, 'Please specify the consultation fees.']
  },
  specialty: { // Main specialty of the clinic/hakeem
    type: String,
    required: [true, 'Please add the primary specialty.']
  },
  experience: { // Years of professional experience
    type: Number,
    default: 0
  },
  images: { // URLs to clinic images
    type: [String],
    default: []
  },
  // Ensure this is the line mentioned in your error, or the structure around it is correct
  // For example, if line 33 was inside the availability array or another object that wasn't closed.
  // The comment itself: "//     open_time: { type: String, required: true }, // Format:" is fine.
  // The problem is likely an unclosed block before or encompassing this line.
  is_active: { // To allow Hakeem to temporarily disable their clinic listing
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Make sure the schema definition is properly closed before this line.
module.exports = mongoose.model('Clinic', clinicSchema);