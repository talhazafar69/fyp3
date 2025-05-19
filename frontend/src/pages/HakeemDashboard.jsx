import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HakeemDashboard.css';

const HakeemDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    userName: 'Dr. Hakeem'
  });

  // Get current date
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Fetch dashboard data and appointments
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Fetch user data
        const userResponse = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        setDashboardData({
          userName: userData.name || 'Dr. Hakeem'
        });
        
        // Fetch appointments
        const appointmentResponse = await fetch('/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!appointmentResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }
        
        const appointmentData = await appointmentResponse.json();
        console.log('Fetched appointments:', appointmentData);
        
        // Format the appointments
        const formattedAppointments = appointmentData.map(app => ({
          id: app._id,
          patientName: app.patient_id?.name || 'Unknown Patient',
          date: new Date(app.date).toLocaleDateString(),
          time: app.time,
          status: app.status === 'booked' ? 'upcoming' : app.status,
          notes: app.notes || 'No notes provided'
        }));
        
        setAppointments(formattedAppointments);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);
  
  // Filter appointments by status
  const upcomingAppointments = appointments.filter(app => app.status === 'upcoming' || app.status === 'booked');
  const completedAppointments = appointments.filter(app => app.status === 'completed');

  // Function to mark appointment as completed
  const markAsCompleted = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }
      
      // Update local state
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: 'completed' } : app
      ));
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert('Failed to update appointment. Please try again.');
    }
  };

  // Handle clinic registration
  const handleClinicRegistration = () => {
    navigate('/clinic-registration');
  };
  
  if (loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <button className="nav-link clinic-btn" onClick={handleClinicRegistration}>Manage Clinic</button>
        </div>
        <div className="header-right">
          <Link to="/profile" className="profile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="dashboard-error">{error}</div>}
        
        <div className="dashboard-welcome">
          <h2>Welcome, {dashboardData.userName}</h2>
          <p className="date">{formattedDate}</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Today's Appointments</h3>
            <p className="stat-number">{upcomingAppointments.length + completedAppointments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming</h3>
            <p className="stat-number">{upcomingAppointments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">{completedAppointments.length}</p>
          </div>
        </div>

        <div className="appointments-section">
          <h2>Appointments</h2>
          
          <div className="appointments-container">
            <div className="appointments-column">
              <h3>Upcoming Appointments</h3>
              {upcomingAppointments.length === 0 ? (
                <p className="no-appointments">No upcoming appointments</p>
              ) : (
                upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <span className="appointment-date">{appointment.date}</span>
                      <span className="appointment-time">{appointment.time}</span>
                      <span className="appointment-status upcoming">Upcoming</span>
                    </div>
                    <h4 className="patient-name">{appointment.patientName}</h4>
                    <p className="appointment-notes">{appointment.notes}</p>
                    <button 
                      className="complete-button"
                      onClick={() => markAsCompleted(appointment.id)}
                    >
                      Mark as Completed
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="appointments-column">
              <h3>Completed Appointments</h3>
              {completedAppointments.length === 0 ? (
                <p className="no-appointments">No completed appointments</p>
              ) : (
                completedAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-card completed">
                    <div className="appointment-header">
                      <span className="appointment-date">{appointment.date}</span>
                      <span className="appointment-time">{appointment.time}</span>
                      <span className="appointment-status completed">Completed</span>
                    </div>
                    <h4 className="patient-name">{appointment.patientName}</h4>
                    <p className="appointment-notes">{appointment.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HakeemDashboard;