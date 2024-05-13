//jest.setup.js
process.env.NODE_ENV = 'test';
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });
global.fetch = require('jest-fetch-mock');

// Mock the Data model
jest.mock('././models/Data', () => {
  const mockSave = jest.fn().mockResolvedValue({ _id: '1', value: 'New data' });

  const mockDataInstance = {
    save: mockSave,
  };

  function Data() {
    return mockDataInstance;
  }

  // Static methods
  Data.deleteMany = jest.fn().mockResolvedValue({});
  Data.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: '1', value: 'Updated data' });
  Data.find = jest.fn(() => ({
    sort: jest.fn().mockResolvedValue([{ _id: '1', value: 'Sample data' }])
  }));

  return Data;
});
