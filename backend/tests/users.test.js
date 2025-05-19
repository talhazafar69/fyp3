const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('User API', () => {
  let token;
  let userId;
  
  beforeEach(async () => {
    // Create a test user
    const user = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'user@test.com',
        password: 'test123456',
        role: 'patient'
      });
    
    token = user.body.token;
    userId = user.body._id;
  });
  
  describe('GET /api/users/me', () => {
    it('should fetch the current user profile', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test User');
      expect(res.body).toHaveProperty('email', 'user@test.com');
      expect(res.body).toHaveProperty('role', 'patient');
    });
    
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/users/me');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
    
    it('should return 401 if invalid token is provided', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token is not valid');
    });
  });
  
  describe('PUT /api/users/me', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated User',
        email: 'updated@test.com',
      };
      
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated User');
      expect(res.body).toHaveProperty('email', 'updated@test.com');
    });
    
    it('should update user password', async () => {
      const updateData = {
        password: 'newpassword123',
      };
      
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      expect(res.statusCode).toBe(200);
      
      // Try logging in with new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'newpassword123'
        });
      
      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body).toHaveProperty('token');
    });
    
    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .send({ name: 'Updated Name' });
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
  });
}); 