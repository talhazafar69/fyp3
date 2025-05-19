const Appointment = require('../models/Appointment');
const Clinic = require('../models/Clinic');
const User = require('../models/User');

// @desc    Get Hakeem dashboard data
// @route   GET /api/dashboard
// @access  Private (Hakeem only)
const getHakeemDashboard = async (req, res, next) => {
  try {
    const hakeemId = req.user.id;
    
    // Find all appointments for this hakeem
    const appointments = await Appointment.find({ 
      hakeem_id: hakeemId
    }).populate('patient_id', 'name email').sort({ date: 1, time: 1 }); 

    // Get basic stats
    const completedAppointments = appointments.filter(app => app.status === 'completed').length;
    const upcomingAppointments = appointments.filter(app => app.status === 'booked').length;
    const totalAppointments = appointments.length;

    // Log for debugging
    console.log(`Dashboard stats: total=${totalAppointments}, completed=${completedAppointments}, upcoming=${upcomingAppointments}`);
    console.log(`Appointments:`, appointments.map(app => ({ 
      status: app.status, 
      date: app.date,
      time: app.time 
    })));

    // Get hakeem's clinic details if available
    const clinic = await Clinic.findOne({ hakeem_id: hakeemId });

    return res.json({
      appointments,
      totalAppointments,
      completedAppointments,
      upcomingAppointments,
      clinic: clinic || null
    });
  } catch (error) {
    console.error('Error in getHakeemDashboard:', error);
    next(error);
  }
};

module.exports = {
  getHakeemDashboard,
};