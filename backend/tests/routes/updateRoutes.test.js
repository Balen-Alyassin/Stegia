const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); 

// Mocking the Data model
jest.mock('../../models/Data', () => {
    return {
      findByIdAndUpdate: jest.fn((id, update, options) => {
        if (id === "non-existent-id") return Promise.resolve(null);
        if (update.status !== 'Passed' && update.status !== 'Failed') return Promise.reject(new Error("Invalid status"));
        return Promise.resolve({ _id: id, ...update });
      }),
      create: jest.fn(data => {
        if (!data.idle_current_24v || data.idle_current_24v < 0 || data.idle_current_24v > 100) return Promise.reject(new Error("Invalid data"));
        return Promise.resolve({ _id: 'mock-id', ...data, save: jest.fn().mockResolvedValue() });
      }),
      find: jest.fn().mockResolvedValue([]),
      deleteMany: jest.fn().mockResolvedValue({})
    };
  });
  
  describe('Update Routes', () => {
    afterAll(async () => {
        await mongoose.disconnect();
        // Optionally, stop any other services or cleanup resources
    });
    describe('Status Update for Data Entry', () => {
      it('should update the status of a data entry', async () => {
        const response = await request(app)
          .put(`/api/data/1`)  // Assuming '1' is a valid ID for the purpose of testing
          .send({ status: 'Passed' });
  
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'Passed');
      });
  
      it('should handle non-existent data entries correctly', async () => {
        const response = await request(app)
          .put(`/api/data/non-existent-id`)
          .send({ status: 'Failed' });
  
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Data not found');
      });
    });
  });