const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  describe('POST /api/auth/signup', () => {
    const patientSignupData = {
      name: 'Test Patient',
      email: 'patient@test.com',
      password: 'test123456',
      role: 'patient'
    };

    const hakeemSignupData = {
      name: 'Test Hakeem',
      email: 'hakeem@test.com',
      password: 'test123456',
      role: 'hakeem',
      license_number: 'HAK123456'
    };

    it('should register a new patient', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(patientSignupData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.role).toBe('patient');
      expect(res.body.email).toBe(patientSignupData.email);
    });

    it('should register a new hakeem', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(hakeemSignupData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.role).toBe('hakeem');
      expect(res.body.license_number).toBe(hakeemSignupData.license_number);
    });

    it('should not register a hakeem without license number', async () => {
      const invalidHakeemData = { ...hakeemSignupData };
      delete invalidHakeemData.license_number;

      const res = await request(app)
        .post('/api/auth/signup')
        .send(invalidHakeemData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should not register with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/signup')
        .send(patientSignupData);

      // Attempt duplicate registration
      const res = await request(app)
        .post('/api/auth/signup')
        .send(patientSignupData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each test
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@test.com',
          password: 'test123456',
          role: 'patient'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123456'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('test@test.com');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'test123456'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });
  });
});