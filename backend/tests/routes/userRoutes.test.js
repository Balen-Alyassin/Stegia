const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const userRoutes = require('../../routes/userRoutes');

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');



const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      User.prototype.save = jest.fn().mockResolvedValue(userData);

      const response = await request(app).post('/api/users/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.text).toBe('User registered successfully');
    });

    it('should return 400 if the user cannot be registered', async () => {
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Registration error'));

      const response = await request(app).post('/api/users/register').send({
        username: 'testuser', email: 'test@example.com', password: 'password123'
      });

      expect(response.status).toBe(400);
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/api/users/register').send({
      username: 'testuser' // Email and password are missing
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Missing required fields");
  });
});

  describe('POST /api/users/login', () => {
    it('should authenticate the user and return a token', async () => {
      User.findOne = jest.fn().mockResolvedValue({
        _id: '123',
        password: '$2a$10$exampleHash'
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('fakeToken');

      const response = await request(app).post('/api/users/login').send({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'User logged in successfully',
        token: 'fakeToken'
      }));
    });

    it('should return 404 if the user is not found', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app).post('/api/users/login').send({
        email: 'unknown@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });
  });
