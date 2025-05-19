const request = require('supertest');
const app = require('../server');
const ChatLog = require('../models/ChatLog');

let patientToken;
let userId;

describe('Chatbot API', () => {
  beforeEach(async () => {
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
    userId = patientRes.body._id;
  });

  describe('POST /api/chatbot', () => {
    it('should process a message', async () => {
      const messageData = {
        message: 'What herbs are good for headache?',
        chatId: 'test-chat-1'
      };

      const res = await request(app)
        .post('/api/chatbot')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(messageData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('response');
    });

    it('should require message content', async () => {
      const res = await request(app)
        .post('/api/chatbot')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ chatId: 'test-chat-1' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('provide a message');
    });
  });

  describe('POST /api/chatbot/history', () => {
    const chatHistoryData = {
      id: 'test-chat-1',
      title: 'Test Chat',
      date: new Date().toISOString(),
      messages: [
        { 
          id: 1,
          sender: 'user',
          text: 'What herbs are good for headache?',
          timestamp: new Date().toISOString()
        },
        { 
          id: 2,
          sender: 'bot',
          text: 'Some common herbs for headache include...',
          timestamp: new Date().toISOString()
        }
      ]
    };

    it('should save chat history', async () => {
      const res = await request(app)
        .post('/api/chatbot/history')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(chatHistoryData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.chatHistory).toHaveProperty('messages');
    });

    it('should update existing chat history', async () => {
      // First save
      await request(app)
        .post('/api/chatbot/history')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(chatHistoryData);

      // Update with new message
      const updatedData = {
        ...chatHistoryData,
        messages: [...chatHistoryData.messages, 
          { 
            id: 3,
            sender: 'user',
            text: 'How often should I take these herbs?',
            timestamp: new Date().toISOString()
          }
        ]
      };

      const res = await request(app)
        .post('/api/chatbot/history')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.chatHistory.messages.length).toBe(3);
    });
  });

  describe('GET /api/chatbot/history', () => {
    beforeEach(async () => {
      // Create some test chat history
      await ChatLog.create({
        user_id: userId,
        chat_id: 'test-chat-1',
        title: 'Test Chat 1',
        messages: [
          { 
            id: 1,
            sender: 'user',
            text: 'Test message 1',
            timestamp: new Date()
          },
          { 
            id: 2,
            sender: 'bot',
            text: 'Test response 1',
            timestamp: new Date()
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      });
    });

    it('should get chat history', async () => {
      const res = await request(app)
        .get('/api/chatbot/history')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('messages');
    });

    it('should return empty array for new user', async () => {
      // Create new user
      const newPatientRes = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'New Patient',
          email: 'newpatient@test.com',
          password: 'test123456',
          role: 'patient'
        });

      const res = await request(app)
        .get('/api/chatbot/history')
        .set('Authorization', `Bearer ${newPatientRes.body.token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(0);
    });
  });
});