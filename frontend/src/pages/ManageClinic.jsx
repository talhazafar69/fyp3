import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageClinic.css';

const ManageClinic = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [clinic, setClinic] = useState({
    name: '',
    specialty: '',
    address: {
      street: '',
      city: ''
    },
    city: '',
    phone_number: '',
    availability: [
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30
      }
    ],
    services_offered: [],
    fees: '',
    images: [],
    is_active: true
  });

  // Fetch existing clinic data if available
  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user's token and data
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const userResponse = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        if (!userData || !userData._id) {
          throw new Error('Invalid user data received');
        }

        // Fetch clinic data using the hakeem ID
        const clinicResponse = await fetch(`/api/clinics/hakeem/${userData._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (clinicResponse.ok) {
          const clinicData = await clinicResponse.json();
          setClinic(clinicData);
        } else if (clinicResponse.status === 404) {
          // This is a first-time user, keep the default empty form
          console.log('No existing clinic found for this hakeem');
        } else {
          const errorData = await clinicResponse.json();
          throw new Error(errorData.message || 'Failed to fetch clinic data');
        }
      } catch (err) {
        console.error('Error fetching clinic data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setClinic({
        ...clinic,
        [parent]: {
          ...clinic[parent],
          [child]: value
        }
      });
    } else {
      setClinic({
        ...clinic,
        [name]: value
      });
    }
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updatedAvailability = [...clinic.availability];
    updatedAvailability[index] = {
      ...updatedAvailability[index],
      [field]: value
    };

    setClinic({
      ...clinic,
      availability: updatedAvailability
    });
  };

  const addAvailabilitySlot = () => {
    setClinic({
      ...clinic,
      availability: [
        ...clinic.availability,
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00',
          slotDuration: 30
        }
      ]
    });
  };

  const removeAvailabilitySlot = (index) => {
    const updatedAvailability = [...clinic.availability];
    updatedAvailability.splice(index, 1);
    setClinic({
      ...clinic,
      availability: updatedAvailability
    });
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...clinic.services_offered];
    updatedServices[index] = value;

    setClinic({
      ...clinic,
      services_offered: updatedServices
    });
  };

  const addService = () => {
    setClinic({
      ...clinic,
      services_offered: [...clinic.services_offered, '']
    });
  };

  const removeService = (index) => {
    const updatedServices = [...clinic.services_offered];
    updatedServices.splice(index, 1);
    setClinic({
      ...clinic,
      services_offered: updatedServices
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!clinic.name || !clinic.specialty || !clinic.address.street || 
          !clinic.city || !clinic.phone_number || !clinic.fees) {
        throw new Error('Please fill in all required fields');
      }

      // Clean up empty services and validate data
      const cleanedServices = clinic.services_offered.filter(service => service && service.trim() !== '');
      
      // Make sure address.city is set to the same value as city
      const clinicData = {
        ...clinic,
        address: {
          ...clinic.address,
          city: clinic.city // Ensure address.city is set correctly
        },
        services_offered: cleanedServices,
        fees: Number(clinic.fees) // Convert fees to number
      };

      // Validate fees is a valid number
      if (isNaN(clinicData.fees)) {
        throw new Error('Please enter a valid fee amount');
      }

      // Validate availability data
      if (!clinicData.availability || clinicData.availability.length === 0) {
        throw new Error('Please add at least one availability slot');
      }

      // Determine if this is a create or update operation
      const method = clinic._id ? 'PUT' : 'POST';
      const url = clinic._id ? `/api/clinics/${clinic._id}` : '/api/clinics';

      // Remove max_appointments_per_day as it's not in the model
      const { max_appointments_per_day, ...submitData } = clinicData;

      console.log('Submitting clinic data:', submitData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save clinic information');
      }

      const savedClinic = await response.json();
      setClinic(savedClinic);
      setSuccess(true);
      
      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        navigate('/hakeem-dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToFindHakeem = () => {
    navigate('/find-hakeem');
  };

  return (
    <div className="manage-clinic-container">
      <header className="clinic-header">
        <div className="logo">
          <h1>AI<span>Hakeem</span></h1>
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/hakeem-dashboard')}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate('/profile')}>Profile</button>
        </div>
      </header>

      <main className="clinic-main">
        <h2 className="page-title">Manage Your Clinic</h2>
        <p className="page-description">Update your clinic details to help patients find and book appointments with you.</p>

        {loading && <div className="loading-spinner">Loading...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {success && (
          <div className="success-message">
            <p>Clinic information saved successfully! Redirecting to dashboard in 3 seconds...</p>
            <button type="button" className="view-listing-button" onClick={goToFindHakeem}>
              View Your Listing Now
            </button>
          </div>
        )}

        <form className="clinic-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Clinic Details</h3>
            <div className="form-group">
              <label htmlFor="name">Clinic Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={clinic.name}
                onChange={handleInputChange}
                placeholder="Enter clinic name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialty">Specialty *</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={clinic.specialty}
                onChange={handleInputChange}
                placeholder="E.g., Herbal Medicine, Digestive Health, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={clinic.experience || ''}
                onChange={handleInputChange}
                placeholder="E.g., 5"
                min="0"
                max="70"
              />
              <span className="field-hint">Enter the number of years of professional experience you have</span>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="address-help-text">
              <p>Both street address and city are required for patients to find your clinic.</p>
            </div>
            <div className="form-group">
              <label htmlFor="address.street">Street Address *</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={clinic.address.street}
                onChange={handleInputChange}
                placeholder="Enter complete street address (e.g., 123 Main St)"
                required
              />
              <span className="field-hint">Include building number, street name, and any suite/unit number</span>
            </div>

            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={clinic.city}
                onChange={handleInputChange}
                placeholder="Enter city name only (e.g., Springfield)"
                required
              />
              <span className="field-hint">Enter city name only - state and zip will be handled separately</span>
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number *</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={clinic.phone_number}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Availability</h3>
            <p className="section-description">Set your working days and hours</p>

            {clinic.availability.map((slot, index) => (
              <div key={index} className="availability-slot">
                <div className="form-group">
                  <label htmlFor={`day-${index}`}>Day</label>
                  <select
                    id={`day-${index}`}
                    value={slot.day}
                    onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`startTime-${index}`}>Start Time</label>
                  <input
                    type="time"
                    id={`startTime-${index}`}
                    value={slot.startTime}
                    onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`endTime-${index}`}>End Time</label>
                  <input
                    type="time"
                    id={`endTime-${index}`}
                    value={slot.endTime}
                    onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`slotDuration-${index}`}>Appointment Duration (minutes)</label>
                  <select
                    id={`slotDuration-${index}`}
                    value={slot.slotDuration}
                    onChange={(e) => handleAvailabilityChange(index, 'slotDuration', parseInt(e.target.value))}
                  >
                    {[15, 30, 45, 60].map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>

                {clinic.availability.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={() => removeAvailabilitySlot(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button 
              type="button" 
              className="add-button"
              onClick={addAvailabilitySlot}
            >
              Add Another Day
            </button>
          </div>

          <div className="form-section">
            <h3>Appointment Settings</h3>
            <div className="form-group">
              <label htmlFor="max_appointments_per_day">Maximum Appointments Per Day</label>
              <input
                type="number"
                id="max_appointments_per_day"
                name="max_appointments_per_day"
                value={clinic.max_appointments_per_day || 10}
                onChange={handleInputChange}
                min="1"
                max="50"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Services & Fees</h3>
            <div className="form-group">
              <label htmlFor="fees">Consultation Fee (PKR) *</label>
              <input
                type="number"
                id="fees"
                name="fees"
                value={clinic.fees}
                onChange={handleInputChange}
                placeholder="Enter consultation fee"
                min="0"
                required
              />
            </div>

            <h4>Services Offered</h4>
            {clinic.services_offered.map((service, index) => (
              <div key={index} className="service-item">
                <div className="form-group">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    placeholder="Enter a service you offer"
                  />
                </div>
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => removeService(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button 
              type="button" 
              className="add-button"
              onClick={addService}
            >
              Add Service
            </button>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/hakeem-dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Clinic Information'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ManageClinic;