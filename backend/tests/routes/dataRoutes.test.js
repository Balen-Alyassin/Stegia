const request = require('supertest');
const express = require('express');
const Data = require('../../models/Data');
const db = require('../../utils/database');

// Mock the Data model
jest.mock('../../models/Data', () => {
  const mockSave = jest.fn().mockResolvedValue({ _id: '1', value: 'New data' });
  
  // Mock the constructor to return an instance with a save method
  const mockDataInstance = { save: mockSave };

  function Data() {
    return mockDataInstance;
  }

  // Static methods
  Data.deleteMany = jest.fn().mockResolvedValue({});
  Data.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: '1', value: 'Updated data' });
  Data.find = jest.fn(() => ({
    sort: jest.fn().mockResolvedValue([{ _id: '1', value: 'Sample data' }])
  }));

  Data.mockSave = mockSave;

  return Data;
});

  

const app = express();
app.use(express.json());

// Importing routes after mocking to ensure they use the mocked model
const dataRoutes = require('../../routes/dataRoutes');
app.use('/api/data', dataRoutes);

beforeAll(async () => {
  await db.connect();
  await db.seedTestData(); // to seed the data to database
});

afterEach(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.disconnect();
});

describe('Data Routes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    

  describe('GET /api/data', () => {
    it('should return all data', async () => {
      const response = await request(app).get('/api/data');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ _id: '1', value: 'Sample data' }]);
    });

    it('should return data filtered by date', async () => {
      const response = await request(app).get('/api/data?startDate=2020-01-01&endDate=2020-01-31');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ _id: '1', value: 'Sample data' }]);
    });
  });

  describe('PUT /api/data/:id', () => {
    it('should update data successfully', async () => {
      const response = await request(app).put('/api/data/1').send({ value: 'Updated data' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ _id: '1', value: 'Updated data' });
    });

    it('should return 404 if data not found', async () => {
      Data.findByIdAndUpdate.mockResolvedValue(null); // Ensure to mock return null for this test
      const response = await request(app).put('/api/data/1').send({ value: 'Updated data' });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Data not found' });
    });
  });

  describe('POST /api/data', () => {
     it('should create data successfully', async () => {
      const postData = { value: 'New data' };
      const response = await request(app).post('/api/data').send(postData);
  

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ _id: '1', value: 'New data' });
    }, 12000);   
  
    it('should return 400 on failure', async () => {
      Data.mockSave.mockRejectedValueOnce(new Error('Failed to save'));  // Using the exposed save mock to inject a rejection
      const response = await request(app).post('/api/data').send({ value: 'New data' });
  
      expect(response.status).toBe(400);
      expect(response.text).toContain('Failed to save');
    });
  });

});

  