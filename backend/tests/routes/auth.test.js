const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const LoginEvent = require('../../models/LoginEvent');

jest.mock('../../models/User');
jest.mock('../../models/LoginEvent');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/api/auth', require('../../routes/auth'));

describe('Authentication API', () => {
  describe('POST /register', () => {
    it('should register a new user and return 201 status', async () => {
      const userData = { username: 'newuser', email: 'newuser@example.com', password: 'password123' };
      User.prototype.save = jest.fn().mockResolvedValue(userData);
      
      const response = await request(app).post('/api/auth/register').send(userData);
      
      expect(response.status).toBe(201);
      expect(response.text).toEqual('User registered');
    });

    it('should return 400 status if registration fails', async () => {
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Failed to register'));
      
      const userData = { username: 'newuser', email: 'newuser@example.com', password: 'password123' };
      const response = await request(app).post('/api/auth/register').send(userData);
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should authenticate user and return token', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      User.findOne = jest.fn().mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        password: '$2a$10$examplehash'
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('testtoken');

      const response = await request(app).post('/api/auth/login').send(userData);
      
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should return 404 if user not found', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const userData = { email: 'nonexistent@example.com', password: 'password123' };

      const response = await request(app).post('/api/auth/login').send(userData);
      
      expect(response.status).toBe(404);
      expect(response.text).toEqual('User not found');
    });
  });
});

