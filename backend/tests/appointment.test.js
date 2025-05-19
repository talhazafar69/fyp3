const request = require('supertest');
const app = require('../server');
const Appointment = require('../models/Appointment');

let patientToken;
let hakeemToken;
let hakeemId;
let clinicId;

describe('Appointment API', () => {
  beforeEach(async () => {
    // Create test hakeem
    const hakeemRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Hakeem',
        email: 'testhakeem@test.com',
        password: 'test123456',
        role: 'hakeem',
        license_number: 'HAK123456'
      });

    hakeemToken = hakeemRes.body.token;
    hakeemId = hakeemRes.body._id;

    // Create test patient
    const patientRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Patient',
        email: 'testpatient@test.com',
        password: 'test123456',
        role: 'patient'
      });

    patientToken = patientRes.body.token;

    // Create test clinic
    const clinicRes = await request(app)
      .post('/api/clinics')
      .set('Authorization', `Bearer ${hakeemToken}`)
      .send({
        name: 'Test Clinic',
        specialty: 'General Practice',
        address: {
          street: '123 Test Street',
          city: 'Test City'
        },
        city: 'Test City',
        phone_number: '1234567890',
        availability: [
          {
            day: 'Monday',
            startTime: '09:00',
            endTime: '17:00',
            slotDuration: 30
          }
        ],
        services_offered: ['Consultation'],
        fees: 100
      });

    clinicId = clinicRes.body._id;
  });

  describe('POST /api/appointments', () => {
    it('should create a new appointment', async () => {
      const appointmentData = {
        hakeem_id: hakeemId,
        date: new Date().toISOString().split('T')[0],
        time: '10:00'
      };

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(appointmentData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('hakeem_id', hakeemId);
      expect(res.body.status).toBe('booked');
    });

    it('should not allow double booking', async () => {
      const appointmentData = {
        hakeem_id: hakeemId,
        date: new Date().toISOString().split('T')[0],
        time: '10:00'
      };

      // Book first appointment
      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(appointmentData);

      // Try to book same slot
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(appointmentData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('not available');
    });
  });

  describe('GET /api/appointments', () => {
    beforeEach(async () => {
      // Create test appointment
      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          hakeem_id: hakeemId,
          date: new Date().toISOString().split('T')[0],
          time: '10:00'
        });
    });

    it('should get patient appointments', async () => {
      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get hakeem appointments', async () => {
      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${hakeemToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/appointments/:appointmentId', () => {
    let appointmentId;

    beforeEach(async () => {
      // Create test appointment
      const appointmentRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          hakeem_id: hakeemId,
          date: new Date().toISOString().split('T')[0],
          time: '10:00'
        });

      appointmentId = appointmentRes.body._id;
    });

    it('should update appointment status', async () => {
      const res = await request(app)
        .put(`/api/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${hakeemToken}`)
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('completed');
    });

    it('should not allow unauthorized status update', async () => {
      const res = await request(app)
        .put(`/api/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ status: 'completed' });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toContain('not authorized');
    });
  });
});