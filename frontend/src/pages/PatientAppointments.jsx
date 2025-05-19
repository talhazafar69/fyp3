import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/PatientAppointments.css';

const PatientAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  });

  // Fetch user appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Get user data
        const userResponse = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        setUserData({
          name: userData.name,
          email: userData.email
        });
        
        // Get patient appointments
        const appointmentsResponse = await fetch('/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }
        
        const appointmentsData = await appointmentsResponse.json();
        console.log('Fetched appointments:', appointmentsData);
        
        // Format appointments data
        const formattedAppointments = appointmentsData.map(app => ({
          id: app._id,
          hakeemName: app.hakeem_id?.name || 'Unknown Hakeem',
          hakeemId: app.hakeem_id?._id || '',
          specialty: app.hakeem_id?.specialty || 'Herbal Medicine',
          date: new Date(app.date),
          formattedDate: new Date(app.date).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          }),
          time: app.time,
          status: app.status,
          notes: app.notes || ''
        }));
        
        // Sort appointments by date and time
        formattedAppointments.sort((a, b) => {
          // First compare dates
          if (a.date > b.date) return 1;
          if (a.date < b.date) return -1;
          
          // If dates are equal, compare times
          return a.time.localeCompare(b.time);
        });
        
        setAppointments(formattedAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load your appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [navigate]);
  
  // Fetch available slots for reschedule
  const fetchAvailableSlots = async (hakeemId, date) => {
    try {
      setLoadingSlots(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/hakeems/${hakeemId}/available-slots?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }
      
      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to fetch available time slots. Please try again.');
    } finally {
      setLoadingSlots(false);
    }
  };
  
  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
      
      // Update UI
      setAppointments(appointments.map(app => 
        app.id === appointmentId ? { ...app, status: 'cancelled' } : app
      ));
      
      alert('Appointment cancelled successfully');
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Open reschedule modal
  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate('');
    setAvailableSlots([]);
    setShowRescheduleModal(true);
  };
  
  // Handle date selection for reschedule
  const handleDateSelect = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (selectedAppointment) {
      await fetchAvailableSlots(selectedAppointment.hakeemId, date);
    }
  };
  
  // Handle appointment rescheduling
  const handleReschedule = async (slot) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Cancel the existing appointment
      await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Create a new appointment
      const bookingResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hakeem_id: selectedAppointment.hakeemId,
          date: selectedDate,
          time: slot.time
        })
      });
      
      if (!bookingResponse.ok) {
        throw new Error('Failed to reschedule appointment');
      }
      
      const newAppointment = await bookingResponse.json();
      
      // Update UI - replace old appointment with new one
      setAppointments(appointments.filter(app => app.id !== selectedAppointment.id));
      
      // Refresh appointment list
      const appointmentsResponse = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        
        // Format appointments data
        const formattedAppointments = appointmentsData.map(app => ({
          id: app._id,
          hakeemName: app.hakeem_id?.name || 'Unknown Hakeem',
          hakeemId: app.hakeem_id?._id || '',
          specialty: app.hakeem_id?.specialty || 'Herbal Medicine',
          date: new Date(app.date),
          formattedDate: new Date(app.date).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          }),
          time: app.time,
          status: app.status,
          notes: app.notes || ''
        }));
        
        // Sort appointments by date and time
        formattedAppointments.sort((a, b) => {
          // First compare dates
          if (a.date > b.date) return 1;
          if (a.date < b.date) return -1;
          
          // If dates are equal, compare times
          return a.time.localeCompare(b.time);
        });
        
        setAppointments(formattedAppointments);
      }
      
      // Close modal
      setShowRescheduleModal(false);
      
      // Show success message
      alert('Appointment rescheduled successfully!');
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      setError('Failed to reschedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate appointment status
  const getAppointmentStatus = (appointment) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    
    if (appointment.status === 'cancelled') {
      return { text: 'Cancelled', class: 'cancelled' };
    } else if (appointment.status === 'completed') {
      return { text: 'Completed', class: 'completed' };
    } else if (appointmentDate < today) {
      return { text: 'Past', class: 'past' };
    } else if (appointmentDate.getTime() === today.getTime()) {
      return { text: 'Today', class: 'today' };
    } else {
      return { text: 'Upcoming', class: 'upcoming' };
    }
  };
  
  // Group appointments by date
  const groupAppointmentsByDate = () => {
    const grouped = {};
    
    appointments.forEach(appointment => {
      if (!grouped[appointment.formattedDate]) {
        grouped[appointment.formattedDate] = [];
      }
      grouped[appointment.formattedDate].push(appointment);
    });
    
    return grouped;
  };
  
  const groupedAppointments = groupAppointmentsByDate();
  
  // Filter appointments by status
  const upcomingAppointments = appointments.filter(app => 
    app.status !== 'cancelled' && app.status !== 'completed' && 
    new Date(app.date) >= new Date().setHours(0, 0, 0, 0)
  );
  
  const pastAppointments = appointments.filter(app => 
    (app.status === 'completed' || new Date(app.date) < new Date().setHours(0, 0, 0, 0)) &&
    app.status !== 'cancelled'
  );
  
  const cancelledAppointments = appointments.filter(app => 
    app.status === 'cancelled'
  );
  
  return (
    <div className="patient-appointments-container">
      <header className="appointments-header">
        <div className="logo">
          <h1>AI<span>Hakeem</span></h1>
        </div>
        <div className="nav-links">
          <Link to="/find-hakeem" className="nav-link">Find Hakeem</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
      </header>
      
      <main className="appointments-main">
        <div className="page-title">
          <h2>My Appointments</h2>
          <p className="welcome-message">Welcome back, {userData.name || 'Patient'}</p>
        </div>
        
        {loading && <div className="loading-spinner">Loading your appointments...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && appointments.length === 0 && (
          <div className="no-appointments-message">
            <h3>You don't have any appointments yet</h3>
            <p>Book your first appointment with a hakeem to get started.</p>
            <Link to="/find-hakeem" className="book-now-button">Find a Hakeem</Link>
          </div>
        )}
        
        {appointments.length > 0 && (
          <div className="appointments-dashboard">
            <div className="appointments-summary">
              <div className="summary-card">
                <h3>Upcoming</h3>
                <span className="count">{upcomingAppointments.length}</span>
              </div>
              <div className="summary-card">
                <h3>Past</h3>
                <span className="count">{pastAppointments.length}</span>
              </div>
              <div className="summary-card">
                <h3>Cancelled</h3>
                <span className="count">{cancelledAppointments.length}</span>
              </div>
            </div>
            
            <div className="appointments-list">
              <h3>My Appointments</h3>
              
              {Object.keys(groupedAppointments).map(date => (
                <div key={date} className="date-group">
                  <h4 className="date-heading">{date}</h4>
                  
                  {groupedAppointments[date].map(appointment => {
                    const status = getAppointmentStatus(appointment);
                    
                    return (
                      <div 
                        key={appointment.id} 
                        className={`appointment-card ${status.class}`}
                      >
                        <div className="appointment-time">
                          <span className="time">{appointment.time}</span>
                          <span className={`status ${status.class}`}>
                            {status.text}
                          </span>
                        </div>
                        
                        <div className="appointment-details">
                          <h4>{appointment.hakeemName}</h4>
                          <p className="specialty">{appointment.specialty}</p>
                          {appointment.notes && (
                            <p className="notes">{appointment.notes}</p>
                          )}
                        </div>
                        
                        <div className="appointment-actions">
                          {appointment.status !== 'cancelled' && 
                           appointment.status !== 'completed' && 
                           new Date(appointment.date) > new Date() && (
                            <>
                              <button 
                                className="reschedule-button"
                                onClick={() => openRescheduleModal(appointment)}
                              >
                                Reschedule
                              </button>
                              
                              <button 
                                className="cancel-button"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {showRescheduleModal && selectedAppointment && (
        <div className="reschedule-modal">
          <div className="modal-content">
            <h3>Reschedule Appointment</h3>
            <p className="modal-details">
              Original appointment: {selectedAppointment.formattedDate} at {selectedAppointment.time} with {selectedAppointment.hakeemName}
            </p>
            
            <div className="date-selection">
              <label htmlFor="reschedule-date">Select a new date:</label>
              <input 
                type="date" 
                id="reschedule-date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={handleDateSelect}
                required
              />
            </div>
            
            {loadingSlots && <div className="loading-spinner">Loading available slots...</div>}
            
            {selectedDate && availableSlots.length > 0 && (
              <div className="time-slots">
                <h4>Select a new time:</h4>
                <div className="slots-grid">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      className="slot-button"
                      onClick={() => handleReschedule(slot)}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedDate && availableSlots.length === 0 && !loadingSlots && (
              <p className="no-slots">No available slots for selected date</p>
            )}
            
            <div className="modal-actions">
              <button 
                className="close-button"
                onClick={() => setShowRescheduleModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments; 