import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    joinDate: ''
  });

  // Form data for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            navigate('/auth');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData({
          name: data.name,
          email: data.email,
          role: data.role,
          joinDate: data.createdAt || new Date().toISOString()
        });

        setFormData({
          name: data.name,
          email: data.email,
          password: '',
          confirmPassword: ''
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Prepare data for update (exclude confirmPassword and empty password)
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          navigate('/auth');
          return;
        }
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      
      // Update user data with response
      setUserData({
        ...userData,
        name: data.name,
        email: data.email
      });

      setEditMode(false);
      setLoading(false);
      setError(null);
      
      // Redirect to profile page to refresh with updated data
      navigate('/profile');
      // Force a reload to ensure data is refreshed
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle clinic registration
  const handleClinicRegistration = () => {
    navigate('/clinic-registration');
  };
  
  // Handle navigating to appointments page (for patients)
  const handleViewAppointments = () => {
    navigate('/appointments');
  };

  // Handle back navigation based on user role
  const handleBackNavigation = () => {
    if (userData.role === 'hakeem') {
      navigate('/hakeem-dashboard');
    } else {
      navigate('/chatbot');
    }
  };

  if (loading && !userData.name) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="header-left">
          <button onClick={handleBackNavigation} className="nav-link back-button">Back</button>
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

      <main className="profile-main">
        {loading && <div className="loading-spinner">Loading profile data...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="profile-content">
            <div className="profile-card">
              {!editMode ? (
                // View Mode
                <>
                  <div className="profile-details">
                    <h2>{userData.name}</h2>
                    <p className="user-role">{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</p>
                    
                    <div className="info-group">
                      <label>Email</label>
                      <p>{userData.email}</p>
                    </div>
                    
                    <div className="info-group">
                      <label>Member Since</label>
                      <p>{new Date(userData.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                    
                    <div className="profile-actions">
                      <button className="edit-profile-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
                      <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                  </div>
                </>
              ) : (
                // Edit Mode
                <div className="edit-profile-form">
                  <h2>Edit Profile</h2>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="password">New Password (leave blank to keep current)</label>
                      <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleInputChange} 
                        disabled={!formData.password} 
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={() => {
                          setEditMode(false);
                          setError(null);
                          // Reset form data to current user data
                          setFormData({
                            name: userData.name,
                            email: userData.email,
                            password: '',
                            confirmPassword: ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
    
export default Profile;