const Clinic = require('../models/Clinic');
const User = require('../models/User'); // To verify hakeem role and ownership

// @desc    Create a new clinic
// @route   POST /api/clinics
// @access  Private (Hakeem only)
const createClinic = async (req, res, next) => {
  try {
    const hakeem_id = req.user.id; // Populated by auth middleware

    // Check if Hakeem already has a clinic
    const existingClinic = await Clinic.findOne({ hakeem_id });
    if (existingClinic) {
      return res.status(400).json({ message: 'You have already registered a clinic.' });
    }

    // Validate required fields
    const requiredFields = ['name', 'specialty', 'address', 'city', 'phone_number', 'fees'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate address structure
    if (!req.body.address.street || !req.body.address.city) {
      return res.status(400).json({
        message: 'Address must include street and city'
      });
    }

    // Validate availability
    if (!req.body.availability || !Array.isArray(req.body.availability) || req.body.availability.length === 0) {
      return res.status(400).json({
        message: 'At least one availability slot is required'
      });
    }

    const clinicData = { ...req.body, hakeem_id };
    const clinic = await Clinic.create(clinicData);

    res.status(201).json(clinic);
  } catch (error) {
    console.error('Clinic creation error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
};

// @desc    Get all clinics (for patient search, can be filtered)
// @route   GET /api/clinics
// @access  Public
const getClinics = async (req, res, next) => {
  try {
    // Basic find, can be extended with search/filter query params (e.g., by city, specialty)
    const { city, specialty, name } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i'); // Case-insensitive search
    if (specialty) filter.specialty = new RegExp(specialty, 'i');
    if (name) filter.name = new RegExp(name, 'i');

    const clinics = await Clinic.find(filter).populate('hakeem_id', 'name email specialty');
    res.json(clinics);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single clinic by ID
// @route   GET /api/clinics/:clinicId
// @access  Public
const getClinicById = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.clinicId).populate('hakeem_id', 'name email specialty');
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json(clinic);
  } catch (error)
{
    next(error);
  }
};

// @desc    Update clinic details
// @route   PUT /api/clinics/:clinicId
// @access  Private (Hakeem owner only)
const updateClinic = async (req, res, next) => {
  try {
    let clinic = await Clinic.findById(req.params.clinicId);

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    // Ensure user is the clinic owner
    if (clinic.hakeem_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this clinic' });
    }

    clinic = await Clinic.findByIdAndUpdate(req.params.clinicId, req.body, {
      new: true,
      runValidators: true
    });

    res.json(clinic);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a clinic
// @route   DELETE /api/clinics/:clinicId
// @access  Private (Hakeem owner only)
const deleteClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.clinicId);

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    // Ensure user is the clinic owner
    if (clinic.hakeem_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this clinic' });
    }

    await clinic.deleteOne(); // Or clinic.remove() for older Mongoose versions

    // Optionally remove clinic ID from User model
    // await User.findByIdAndUpdate(clinic.hakeem_id, { $unset: { clinic_id: "" } });

    res.json({ message: 'Clinic removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get clinic by hakeem ID
// @route   GET /api/clinics/hakeem/:hakeemId
// @access  Public
const getClinicByHakeemId = async (req, res, next) => {
  try {
    const clinic = await Clinic.findOne({ hakeem_id: req.params.hakeemId }).populate('hakeem_id', 'name email specialty');
    if (!clinic) {
      return res.status(404).json({ message: 'No clinic found for this hakeem' });
    }
    res.json(clinic);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClinic,
  getClinics,
  getClinicById,
  updateClinic,
  deleteClinic,
  getClinicByHakeemId
};