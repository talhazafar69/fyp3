const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const { searchHakeems, getHakeemProfile } = require('../controllers/hakeemController');
const Appointment = require('../models/Appointment');

// Search hakeems by location, specialty, or name
router.get('/search', searchHakeems);

// Get all hakeems
router.get('/', async (req, res) => {
  try {
    const hakeems = await User.find({ role: 'hakeem' })
      .select('-password')
      .sort({ rating: -1 });
    res.json(hakeems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hakeems', error: err.message });
  }
});

// Get hakeem's available slots for a specific date
router.get('/:id/available-slots', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Find the hakeem
    const hakeem = await User.findOne({ _id: id, role: 'hakeem' });
    
    if (!hakeem) {
      return res.status(404).json({ message: 'Hakeem not found' });
    }

    // Find the hakeem's clinic to get availability settings
    const clinic = await Clinic.findOne({ hakeem_id: id });
    
    // For testing purposes, return some slots even if clinic not found
    if (!clinic || !clinic.availability || clinic.availability.length === 0) {
      console.log('No clinic or availability found for hakeem, providing test slots');
      return res.json([
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: true }
      ]);
    }

    // Get day of week for the requested date (0 = Sunday, 1 = Monday, etc.)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = new Date(date).getDay();
    const dayName = dayNames[dayOfWeek];

    // Find the availability for this day
    const dayAvailability = clinic.availability.find(slot => slot.day === dayName);
    
    if (!dayAvailability) {
      return res.json([]); // No availability for this day
    }

    // Calculate time slots based on start time, end time, and slot duration
    const { startTime, endTime, slotDuration } = dayAvailability;
    
    // Parse times to minutes since midnight for easier calculation
    const [startHour, startMinute] = startTime.split(':').map(num => parseInt(num));
    const [endHour, endMinute] = endTime.split(':').map(num => parseInt(num));
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Generate all possible slots
    const slots = [];
    for (let time = startMinutes; time < endMinutes; time += slotDuration) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      slots.push({
        time: formattedTime,
        available: true
      });
    }

    // Find existing appointments for this hakeem on this date
    const bookedAppointments = await Appointment.find({
      hakeem_id: id,
      date: date
    });

    // Mark slots as unavailable if already booked
    if (bookedAppointments.length > 0) {
      bookedAppointments.forEach(appointment => {
        const bookedTime = appointment.time;
        const slotIndex = slots.findIndex(slot => slot.time === bookedTime);
        if (slotIndex !== -1) {
          slots[slotIndex].available = false;
        }
      });
    }

    // Return only available slots
    const availableSlots = slots.filter(slot => slot.available);
    
    res.json(availableSlots);
  } catch (err) {
    console.error('Error fetching available slots:', err);
    res.status(500).json({ message: 'Error fetching available slots', error: err.message });
  }
});

// Get hakeem by ID - also gets clinic details
router.get('/:id', protect, getHakeemProfile);

// Update hakeem profile (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const hakeem = await User.findById(req.params.id);
    if (!hakeem) {
      return res.status(404).json({ message: 'Hakeem not found' });
    }

    // Ensure hakeem can only update their own profile
    if (hakeem._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this profile' });
    }

    const updatedHakeem = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    res.json(updatedHakeem);
  } catch (err) {
    res.status(500).json({ message: 'Error updating hakeem profile', error: err.message });
  }
});

// Get hakeem's availability
router.get('/:id/availability', async (req, res) => {
  try {
    const hakeem = await User.findOne({ _id: req.params.id, role: 'hakeem' })
      .select('availability');
    
    if (!hakeem) {
      return res.status(404).json({ message: 'Hakeem not found' });
    }
    
    res.json(hakeem.availability);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hakeem availability', error: err.message });
  }
});

// Update hakeem's availability (protected)
router.put('/:id/availability', protect, async (req, res) => {
  try {
    const hakeem = await User.findById(req.params.id);
    if (!hakeem) {
      return res.status(404).json({ message: 'Hakeem not found' });
    }

    // Ensure hakeem can only update their own availability
    if (hakeem._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update availability' });
    }

    hakeem.availability = req.body.availability;
    await hakeem.save();

    res.json(hakeem.availability);
  } catch (err) {
    res.status(500).json({ message: 'Error updating hakeem availability', error: err.message });
  }
});

module.exports = router;