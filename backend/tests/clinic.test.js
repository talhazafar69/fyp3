const request = require('supertest');
const app = require('../server');
const Clinic = require('../models/Clinic');

let hakeemToken;
let hakeemId;

describe('Clinic API', () => {
  beforeEach(async () => {
    // Create a test hakeem and get token
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
  });

  describe('POST /api/clinics', () => {
    const validClinicData = {
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
      services_offered: ['Consultation', 'Checkup'],
      fees: 100
    };

    it('should create a new clinic', async () => {
      const res = await request(app)
        .post('/api/clinics')
        .set('Authorization', `Bearer ${hakeemToken}`)
        .send(validClinicData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', validClinicData.name);
      expect(res.body.hakeem_id).toBe(hakeemId);
    });

    it('should not create clinic without required fields', async () => {
      const invalidData = { ...validClinicData };
      delete invalidData.name;

      const res = await request(app)
        .post('/api/clinics')
        .set('Authorization', `Bearer ${hakeemToken}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('name');
    });

    it('should not allow hakeem to create multiple clinics', async () => {
      // Create first clinic
      await request(app)
        .post('/api/clinics')
        .set('Authorization', `Bearer ${hakeemToken}`)
        .send(validClinicData);

      // Attempt to create second clinic
      const res = await request(app)
        .post('/api/clinics')
        .set('Authorization', `Bearer ${hakeemToken}`)
        .send(validClinicData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('already registered');
    });
  });

  describe('GET /api/clinics', () => {
    beforeEach(async () => {
      // Create a test clinic
      await request(app)
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
    });

    it('should get all clinics', async () => {
      const res = await request(app).get('/api/clinics');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter clinics by city', async () => {
      const res = await request(app)
        .get('/api/clinics')
        .query({ city: 'Test City' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0].city).toBe('Test City');
    });

    it('should filter clinics by specialty', async () => {
      const res = await request(app)
        .get('/api/clinics')
        .query({ specialty: 'General Practice' });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0].specialty).toBe('General Practice');
    });
  });
});