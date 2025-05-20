import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../config/api';
import '../styles/Auth.css';

const Auth = () => {
  // State for form data and UI controls
  const [isLogin, setIsLogin] = useState(true);
  const [userRole, setUserRole] = useState('patient');
  const [authMethod, setAuthMethod] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseNumber: ''
  });
  // State for displaying messages to the user
  const [message, setMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle toggle switches
  const handleRoleToggle = (role) => {
    setUserRole(role);
  };

  const handleAuthMethodToggle = (method) => {
    setAuthMethod(method);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    // Form validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (userRole === 'hakeem' && !formData.licenseNumber && !isLogin) {
      setMessage('License number is required for hakeem registration');
      return;
    }

    // Create payload based on auth method
    const payload = {
      password: formData.password,
      role: userRole
    };

    if (authMethod === 'email') {
      payload.email = formData.email;
    } else {
      payload.phone = formData.phone;
    }

    if (!isLogin) {
      payload.name = formData.name;
      if (userRole === 'hakeem') {
        payload.license_number = formData.licenseNumber;
      }
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const data = await fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setMessage(`${isLogin ? 'Login' : 'Signup'} successful! Redirecting...`);

      // Store token if present
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirect based on backend redirectUrl if provided
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        window.location.href = '/'; // fallback redirect
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <p>Welcome to AI Hakeem</p>
        </div>

        {/* Display message */}
        {message && <div className={`message ${response.ok ? 'success' : 'error'}`}>{message}</div>}


        <div className="toggle-container">
          {/* Role Toggle Switch */}
          <div className="toggle-group">
            <label>Select Role</label>
            <div
              className="toggle-switch"
              data-active={userRole === 'patient' ? 'left' : 'right'}
            >
              <div
                className="toggle-option"
                onClick={() => handleRoleToggle('patient')}
              >
                Patient
              </div>
              <div
                className="toggle-option"
                onClick={() => handleRoleToggle('hakeem')}
              >
                Hakeem
              </div>
              <div className="toggle-slider"></div>
            </div>
          </div>

          {/* Auth Method Toggle Switch */}
          <div className="toggle-group">
            <label>Login Method</label>
            <div
              className="toggle-switch"
              data-active={authMethod === 'email' ? 'left' : 'right'}
            >
              <div
                className="toggle-option"
                onClick={() => handleAuthMethodToggle('email')}
              >
                Email
              </div>
              <div
                className="toggle-option"
                onClick={() => handleAuthMethodToggle('phone')}
              >
                Phone
              </div>
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name field (only for signup) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email or Phone based on selected auth method */}
          {authMethod === 'email' ? (
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
          )}

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="eye-icon">{showPassword ? "👁️" : "👁️"}</span>
            </button>
          </div>

          {/* Confirm Password (only for signup) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="eye-icon">{showConfirmPassword ? "👁️" : "👁️"}</span>
              </button>
            </div>
          )}

          {/* License Number (only for hakeem signup) */}
          {userRole === 'hakeem' && !isLogin && (
            <div className="form-group">
              <label htmlFor="licenseNumber">License Number</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                placeholder="Enter your hakeem license number"
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="toggle-auth-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
          <Link to="/" className="back-to-home">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;