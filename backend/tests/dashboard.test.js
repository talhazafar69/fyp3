const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

describe('Dashboard API', () => {
  let patientToken;
  let hakeemToken;
  let patientId;
  let hakeemId;
  let appointmentId;
  
  beforeEach(async () => {
    // Create a test patient
    const patientResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Patient',
        email: 'patient@test.com',
        password: 'test123456',
        role: 'patient'
      });
    
    patientToken = patientResponse.body.token;
    patientId = patientResponse.body._id;
    
    // Create a test hakeem
    const hakeemResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Hakeem',
        email: 'hakeem@test.com',
        password: 'test123456',
        role: 'hakeem',
        license_number: 'HAK123456',
        specialty: 'General Herbalist',
        location: 'Lahore'
      });
    
    hakeemToken = hakeemResponse.body.token;
    hakeemId = hakeemResponse.body._id;
    
    // Create test appointments
    // 1. Create a completed appointment
    const completedAppointment = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        hakeem_id: hakeemId,
        date: new Date().toISOString().split('T')[0], // Today
        time: '10:00 AM',
        notes: 'Test appointment'
      });
      
    appointmentId = completedAppointment.body._id;
    
    // Now update to completed status
    await request(app)
      .put(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${hakeemToken}`)
      .send({
        status: 'completed'
      });
    
    // 2. Create an upcoming appointment
    await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        hakeem_id: hakeemId,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time: '11:00 AM',
        notes: 'Future appointment'
      });
  });
  
  describe('GET /api/dashboard', () => {
    it('should return hakeem dashboard data', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${hakeemToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('appointments');
      expect(res.body).toHaveProperty('totalAppointments');
      expect(res.body).toHaveProperty('completedAppointments');
      expect(res.body).toHaveProperty('upcomingAppointments');
    });
    
    it('should return 403 for patient trying to access hakeem dashboard', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(403);
    });
    
    it('should return 401 if no token provided', async () => {
      const res = await request(app).get('/api/dashboard');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
  });
  
  // Test with appointments data
  describe('Dashboard with appointment data', () => {
    it('should show correct appointment counts on dashboard', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${hakeemToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.totalAppointments).toBe(2);
      expect(res.body.completedAppointments).toBe(1);
      expect(res.body.upcomingAppointments).toBe(1);
      expect(res.body.appointments).toHaveLength(2);
    });
  });
}); 