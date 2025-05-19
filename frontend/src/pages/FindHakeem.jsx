import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FindHakeem.css';

const FindHakeem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedHakeemId, setSelectedHakeemId] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [hakeems, setHakeems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Mock data for demonstration
  const specialties = [
    'General Herbalist',
    'Digestive Health',
    'Respiratory Health',
    'Skin Care',
    'Joint & Muscle Health',
    'Women\'s Health'
  ];

  const locations = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Peshawar',
    'Multan'
  ];

  // Load all hakeems when the component mounts
  useEffect(() => {
    fetchAllHakeems();
  }, []);

  // Check user role on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.role);
          console.log('User role:', userData.role);
        }
      } catch (err) {
        console.error('Error checking user role:', err);
      }
    };
    
    checkUserRole();
  }, []);

  // Function to fetch all hakeems without filters
  const fetchAllHakeems = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/hakeems/search', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 401) {
        setError('Your session has expired. Please login again.');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch hakeems');
      
      const data = await response.json();
      console.log('Initial load - fetched hakeems with clinic data:', data);
      
      // Check if we actually received clinic data
      if (data.length > 0) {
        data.forEach((hakeem, index) => {
          console.log(`Hakeem ${index + 1}:`, hakeem.name);
          console.log(`Has clinic data: ${hakeem.clinic ? 'Yes' : 'No'}`);
          if (hakeem.clinic) {
            console.log('Clinic details:', hakeem.clinic);
          }
        });
      }
      
      setHakeems(data);
    } catch (err) {
      setError('Failed to fetch hakeems. Please try again.');
      console.error('Initial load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Original search function for filtering
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login page instead of showing error
        window.location.href = '/login';
        return;
      }

      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('name', searchQuery);
      if (selectedSpecialty) queryParams.append('specialty', selectedSpecialty);
      if (selectedLocation) queryParams.append('location', selectedLocation);

      const response = await fetch(`/api/hakeems/search?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 401) {
        setError('Your session has expired. Please login again.');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch hakeems');
      
      const data = await response.json();
      console.log('Search results - fetched hakeems with clinic data:', data);
      
      // Check if we actually received clinic data
      if (data.length > 0) {
        data.forEach((hakeem, index) => {
          console.log(`Hakeem ${index + 1}:`, hakeem.name);
          console.log(`Has clinic data: ${hakeem.clinic ? 'Yes' : 'No'}`);
          if (hakeem.clinic) {
            console.log('Clinic details:', hakeem.clinic);
          }
        });
      }
      
      setHakeems(data);
    } catch (err) {
      setError('Failed to fetch hakeems. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (hakeemId, date) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to view available slots');
        return;
      }

      const response = await fetch(`/api/hakeems/${hakeemId}/available-slots?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 401) {
        alert('Your session has expired. Please login again.');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch available slots');
      
      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      alert('Failed to fetch available slots. Please try again.');
      console.error('Fetch slots error:', err);
    }
  };

  const handleBookAppointment = async (hakeemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book an appointment');
      return;
    }

    // Check if user is a hakeem (can't book appointments)
    if (userRole === 'hakeem') {
      alert('As a hakeem, you cannot book appointments. Please log in as a patient to book appointments.');
      return;
    }
    
    setSelectedHakeemId(hakeemId);
    setShowDatePicker(true);
  };

  const handleDateSelect = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    await fetchAvailableSlots(selectedHakeemId, date);
  };

  const handleSlotSelect = async (slot) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book an appointment');
        return;
      }
      
      // Check if user is a hakeem (can't book appointments)
      if (userRole === 'hakeem') {
        alert('As a hakeem, you cannot book appointments. Please log in as a patient to book appointments.');
        return;
      }

      const bookingResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          hakeem_id: selectedHakeemId,
          date: selectedDate,
          time: slot.time
        })
      });

      if (bookingResponse.status === 401) {
        alert('Your session has expired. Please login again.');
        return;
      }
      
      if (bookingResponse.status === 403) {
        alert('You must be logged in as a patient to book appointments.');
        return;
      }
      
      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to book appointment');
      }
      
      alert('Appointment booked successfully!');
      setShowDatePicker(false);
      setSelectedHakeemId(null);
      setSelectedDate('');
      setAvailableSlots([]);
    } catch (err) {
      alert(`Failed to book appointment: ${err.message}`);
      console.error('Booking error:', err);
    }
  };

  return (
    <div className="find-hakeem-container">
      <header className="find-hakeem-header">
        <div className="header-left">
          <h1>Find a <span>Hakeem</span></h1>
          <p>Book appointments with the best herbal medicine practitioners</p>
        </div>
        <div className="header-right">
          <button 
            onClick={fetchAllHakeems} 
            className="reload-button" 
            disabled={loading}
          >
            {loading ? 'Loading...' : '↻ Refresh Listings'}
          </button>
          <Link to="/profile" className="profile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
          <Link to="/appointments" className="appointments-button">
            My Appointments
          </Link>
          <Link to="/chatbot" className="back-button">
            ← Back to Chatbot
          </Link>
        </div>
      </header>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by name or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">Select Specialty</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="hakeems-grid">
        {hakeems.map((hakeem) => (
          <div key={hakeem._id} className="hakeem-card">
            <div className="hakeem-image">{hakeem.image || '👨‍⚕️'}</div>
            <div className="hakeem-info">
              <h3>{hakeem.name}</h3>
              <p className="specialty">{hakeem.clinic?.specialty || hakeem.specialty || 'General Herbalist'}</p>
              <p className="location">📍 {hakeem.clinic?.city || hakeem.clinic?.address?.city || hakeem.location || 'Not specified'}</p>
              <p className="experience">Experience: {hakeem.experience || 'Not specified'}</p>
              <div className="rating">
                Rating: {hakeem.rating || 'N/A'} {hakeem.rating ? '⭐' : ''}
              </div>
              
              {hakeem.clinic ? (
                <div className="clinic-info">
                  <p className="clinic-name">Clinic: {hakeem.clinic.name || 'Not specified'}</p>
                  <p className="clinic-address">
                    Address: {hakeem.clinic.address?.street ? 
                             `${hakeem.clinic.address.street}, ${hakeem.clinic.address.city || hakeem.clinic.city || ''}` : 
                             'Not specified'}
                  </p>
                  <p className="clinic-fees">Fees: Rs. {hakeem.clinic.fees || 'Not specified'}</p>
                  {hakeem.clinic.services_offered && hakeem.clinic.services_offered.length > 0 && (
                    <p className="clinic-services">Services: {hakeem.clinic.services_offered.join(', ')}</p>
                  )}
                </div>
              ) : (
                <p className="no-clinic-info">No clinic information available</p>
              )}
              
              <p className="availability">{hakeem.availability || 'Check availability'}</p>
              <button
                onClick={() => handleBookAppointment(hakeem._id)}
                className="book-button"
                disabled={userRole === 'hakeem'}
                title={userRole === 'hakeem' ? 'You must be logged in as a patient to book appointments' : ''}
              >
                {userRole === 'hakeem' ? 'Login as Patient to Book' : 'Book Appointment'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {hakeems.length === 0 && !loading && (
        <div className="no-results">No hakeems found matching your criteria.</div>
      )}

      {showDatePicker && (
        <div className="date-picker-modal">
          <div className="date-picker-content">
            <h3>Select Appointment Date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateSelect}
              min={new Date().toISOString().split('T')[0]}
            />
            {availableSlots.length > 0 && (
              <div className="time-slots">
                <h4>Available Time Slots</h4>
                <div className="slots-grid">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className="slot-button"
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {selectedDate && availableSlots.length === 0 && (
              <p className="no-slots">No available slots for selected date</p>
            )}
            <button
              onClick={() => {
                setShowDatePicker(false);
                setSelectedHakeemId(null);
                setSelectedDate('');
                setAvailableSlots([]);
              }}
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindHakeem;