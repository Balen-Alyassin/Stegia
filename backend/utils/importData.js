//importData.js
require('dotenv').config({path: '../.env'});

const mongoose = require('mongoose');
const Data = require('../models/Data'); 
const mockData = require('../../src/data/mock_data2'); 

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
});

const importData = async () => {
    console.log("Data to be imported:", JSON.stringify(mockData, null, 2));
  try {
    //await Data.deleteMany();
    
    const dataToInsert = mockData.map(({ id, ...rest }) => rest); // Exclude the 'id' field

    await Data.insertMany(dataToInsert);
    console.log('Data imported successfully to mongoDB with Unique ID');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
