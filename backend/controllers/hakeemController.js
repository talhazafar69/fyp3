const User = require('../models/User');
const Clinic = require('../models/Clinic');

// @desc    Search for hakeems by location, specialty, or name
// @route   GET /api/hakeems
// @access  Public
const searchHakeems = async (req, res, next) => {
  try {
    const { location, specialty, name } = req.query;
    
    // Base query to find users with role 'hakeem'
    let query = { role: 'hakeem' };
    
    // Add name filter if provided
    if (name) {
      query.name = new RegExp(name, 'i'); // Case-insensitive search
    }
    
    // Find hakeems based on query
    const hakeems = await User.find(query).select('-password');
    
    // If location or specialty is provided, we need to filter by clinic details
    if (location || specialty) {
      // Get all hakeem IDs
      const hakeemIds = hakeems.map(hakeem => hakeem._id);
      
      // Build clinic query
      let clinicQuery = { hakeem_id: { $in: hakeemIds } };
      
      if (location) {
        // Search in both city and address fields
        clinicQuery.$or = [
          { city: new RegExp(location, 'i') },
          { address: new RegExp(location, 'i') }
        ];
      }
      
      if (specialty) {
        clinicQuery.specialty = new RegExp(specialty, 'i');
      }
      
      // Find matching clinics
      const clinics = await Clinic.find(clinicQuery);
      
      // Get hakeem IDs from matching clinics
      const matchingHakeemIds = clinics.map(clinic => clinic.hakeem_id.toString());
      
      // Filter hakeems to only those with matching clinics
      const filteredHakeems = hakeems.filter(hakeem => 
        matchingHakeemIds.includes(hakeem._id.toString())
      );
      
      // Return filtered hakeems with their clinic details
      const result = await Promise.all(filteredHakeems.map(async (hakeem) => {
        const clinic = clinics.find(c => c.hakeem_id.toString() === hakeem._id.toString());
        return {
          ...hakeem.toObject(),
          clinic: clinic || null
        };
      }));
      
      return res.json(result);
    }
    
    // If no clinic filters, just return the hakeems
    // But still populate with clinic info if available
    const result = await Promise.all(hakeems.map(async (hakeem) => {
      const clinic = await Clinic.findOne({ hakeem_id: hakeem._id });
      return {
        ...hakeem.toObject(),
        clinic: clinic || null,
        specialty: hakeem.specialty || (clinic ? clinic.specialty : null),
        location: hakeem.location || (clinic ? clinic.city : null)
      };
    }));
    
    res.json(result);
  } catch (error) {
    console.error("Error in searchHakeems:", error);
    next(error);
  }
};

// @desc    Get detailed hakeem profile by ID
// @route   GET /api/hakeems/:id
// @access  Public
const getHakeemProfile = async (req, res, next) => {
  try {
    const hakeem = await User.findById(req.params.id).select('-password');
    
    if (!hakeem || hakeem.role !== 'hakeem') {
      return res.status(404).json({ message: 'Hakeem not found' });
    }
    
    // Get clinic details
    const clinic = await Clinic.findOne({ hakeem_id: hakeem._id });
    
    // Add specialty and location even if stored at the user level
    const hakeemData = {
      ...hakeem.toObject(),
      clinic: clinic || null,
      specialty: hakeem.specialty || (clinic ? clinic.specialty : null),
      location: hakeem.location || (clinic ? clinic.city : null)
    };
    
    res.json(hakeemData);
  } catch (error) {
    console.error('Error in getHakeemProfile:', error);
    // For invalid ObjectId, return 404
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Hakeem not found' });
    }
    next(error);
  }
};

module.exports = {
  searchHakeems,
  getHakeemProfile
};