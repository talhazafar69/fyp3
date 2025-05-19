import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo-centered">
          <h1>AI<span>Hakeem</span></h1>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Pakistani Herbal Medicine AI & Appointment System</h2>
            <p>Get personalized herbal medicine recommendations and book appointments with certified hakeems.</p>
            <div className="cta-buttons">
              <Link to="/chatbot" className="btn btn-solid btn-large">Try Chatbot</Link>
              <Link to="/hakeems" className="btn btn-outline btn-large">Find Hakeems</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/herbal-medicine.svg" alt="Herbal Medicine Illustration" />
          </div>
        </section>

        <section className="features-section">
          <h3>Our Features</h3>
          
          <div className="features-container">
            <div className="features-column">
              <h4 className="user-type-heading">For Patients</h4>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">🌿</div>
                  <div className="feature-text">
                    <h5>AI-Powered Herbal Recommendations</h5>
                    <p>Get personalized herbal medicine suggestions based on your symptoms using our advanced AI system.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📅</div>
                  <div className="feature-text">
                    <h5>Easy Appointment Booking</h5>
                    <p>Schedule appointments with certified hakeems at your preferred time and location with just a few clicks.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👨‍⚕️</div>
                  <div className="feature-text">
                    <h5>Find Qualified Hakeems</h5>
                    <p>Browse through detailed profiles of certified hakeems, read reviews, and choose the best match for your needs.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📱</div>
                  <div className="feature-text">
                    <h5>Personal Health Dashboard</h5>
                    <p>Track your appointments, view medicine recommendations, and maintain your health records in one place.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="features-column">
              <h4 className="user-type-heading">For Hakeems</h4>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">🏥</div>
                  <div className="feature-text">
                    <h5>Clinic Management</h5>
                    <p>Efficiently manage your clinic operations, patient records, and treatment plans through our integrated system.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-text">
                    <h5>Appointment Management</h5>
                    <p>Organize your schedule, receive appointment requests, and send reminders to patients automatically.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👤</div>
                  <div className="feature-text">
                    <h5>Professional Profile</h5>
                    <p>Create a comprehensive profile showcasing your qualifications, specialties, and services to attract more patients.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📈</div>
                  <div className="feature-text">
                    <h5>Practice Analytics</h5>
                    <p>Gain insights into your practice with detailed analytics on patient visits, treatments, and business growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="about-herbal-section">
          <div className="about-content-centered">
            <h3>Pakistani Herbal Medicine & AI</h3>
            <div className="about-text-centered">
              <p>Pakistani herbal medicine has a rich history dating back thousands of years, combining traditional wisdom with natural remedies. AI Hakeem brings this ancient knowledge into the digital age through advanced artificial intelligence.</p>
              <p>Our system analyzes your symptoms and health conditions to recommend appropriate herbal treatments based on established practices in Unani and Ayurvedic medicine traditions prevalent in Pakistan.</p>
              <h4>How AI Hakeem Works:</h4>
              <div className="steps-container">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-text">Describe your symptoms to our AI chatbot</div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-text">Receive personalized herbal medicine recommendations</div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-text">Connect with certified hakeems for professional consultation</div>
                </div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-text">Book appointments and track your treatment progress</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>AI<span>Hakeem</span></h2>
            <p>Bridging traditional herbal medicine with modern technology</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <Link to="/chatbot">AI Chatbot</Link>
              <Link to="/hakeems">Find Hakeems</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
            <div className="footer-column">
             
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          
        </div>
      </footer>
    </div>
  );
};

export default Landing;