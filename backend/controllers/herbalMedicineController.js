const HerbalMedicine = require('../models/HerbalMedicine');

// @desc    Get list of herbal medicines
// @route   GET /api/herbal-medicines
// @access  Public
const getHerbalMedicines = async (req, res) => {
  try {
    const medicines = await HerbalMedicine.find({});
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get details of a specific herbal medicine
// @route   GET /api/herbal-medicines/:id
// @access  Public
const getHerbalMedicineById = async (req, res) => {
  try {
    const medicine = await HerbalMedicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Herbal medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search herbal medicines by symptoms or name
// @route   GET /api/herbal-medicines/search
// @access  Public
const searchHerbalMedicines = async (req, res) => {
  try {
    const { symptom, name } = req.query;
    let query = {};
    
    if (symptom) {
      query.symptoms = new RegExp(symptom, 'i');
    }
    
    if (name) {
      query.name = new RegExp(name, 'i');
    }
    
    const medicines = await HerbalMedicine.find(query);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHerbalMedicines,
  getHerbalMedicineById,
  searchHerbalMedicines
};