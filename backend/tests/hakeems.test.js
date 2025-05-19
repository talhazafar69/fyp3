const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Clinic = require('../models/Clinic');

describe('Hakeem API', () => {
  let patientToken;
  let hakeemToken;
  let hakeemId;
  
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
    
    // Create a clinic for the hakeem
    await request(app)
      .post('/api/clinics')
      .set('Authorization', `Bearer ${hakeemToken}`)
      .send({
        name: 'Test Clinic',
        address: 'Test Address',
        city: 'Lahore',
        phone: '1234567890',
        specialty: 'General Herbalist',
        services_offered: ['Consultation', 'Herbal Remedies'],
        fees: 1000,
        availability: [
          {
            day: 'Monday',
            startTime: '09:00',
            endTime: '17:00',
            slotDuration: 30
          }
        ]
      });
  });
  
  describe('GET /api/hakeems/search', () => {
    it('should search hakeems without filters', async () => {
      const res = await request(app)
        .get('/api/hakeems/search')
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('role', 'hakeem');
    });
    
    it('should search hakeems by name', async () => {
      const res = await request(app)
        .get('/api/hakeems/search?name=Test')
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toContain('Test');
    });
    
    it('should search hakeems by specialty', async () => {
      const res = await request(app)
        .get('/api/hakeems/search?specialty=General')
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
    
    it('should search hakeems by location', async () => {
      const res = await request(app)
        .get('/api/hakeems/search?location=Lahore')
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
    
    it('should return empty array when no matches found', async () => {
      const res = await request(app)
        .get('/api/hakeems/search?name=NonExistent')
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(0);
    });
  });
  
  describe('GET /api/hakeems/:id', () => {
    it('should get a specific hakeem profile by ID', async () => {
      const res = await request(app)
        .get(`/api/hakeems/${hakeemId}`)
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', hakeemId);
      expect(res.body).toHaveProperty('role', 'hakeem');
      expect(res.body).toHaveProperty('name', 'Test Hakeem');
    });
    
    it('should return 404 for non-existent hakeem ID', async () => {
      const nonExistentId = '60f7a9b0f661ab001c9b0c31'; // Valid MongoDB ID format that doesn't exist
      
      const res = await request(app)
        .get(`/api/hakeems/${nonExistentId}`)
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Hakeem not found');
    });
    
    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .get(`/api/hakeems/${hakeemId}`);
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
  });

  describe('GET /api/hakeems/:hakeemId/available-slots', () => {
    it('should return available slots for a hakeem', async () => {
      // First create a clinic with availability
      await request(app)
        .post('/api/clinics')
        .set('Authorization', `Bearer ${hakeemToken}`)
        .send({
          name: 'Test Clinic',
          address: '123 Test Street',
          city: 'Lahore',
          phone: '1234567890',
          specialty: 'General Herbalist',
          fees: 1000,
          availability: [
            {
              day: 'Monday',
              startTime: '09:00',
              endTime: '17:00',
              slotDuration: 30
            }
          ],
          services_offered: ['Consultation', 'Herbal Medicine']
        });
      
      const date = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
      
      const res = await request(app)
        .get(`/api/hakeems/${hakeemId}/available-slots?date=${date}`)
        .set('Authorization', `Bearer ${patientToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

}); 