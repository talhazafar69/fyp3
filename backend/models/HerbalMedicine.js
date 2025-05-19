const mongoose = require('mongoose');

const herbalMedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a medicine name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  indications: {
    type: [String], // Array of symptoms, e.g., ["cough", "fever"]
    required: [true, 'Please provide at least one indication']
  },
  usage: {
    type: String,
    required: false,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create text indexes for searching
herbalMedicineSchema.index({ name: 'text', description: 'text', indications: 'text' });

// Static method to find medicines by symptoms
herbalMedicineSchema.statics.findBySymptoms = async function(symptoms) {
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return [];
  }
  
  // Create a query to find medicines that match any of the symptoms
  const query = {
    indications: { $in: symptoms.map(s => new RegExp(s, 'i')) }
  };
  
  return this.find(query);
};

module.exports = mongoose.model('HerbalMedicine', herbalMedicineSchema);