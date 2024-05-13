require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');
const Data = require('../models/Data');
const mockData = require('../../src/data/mock_data2');

async function importData() {
    try {
        console.log("Data to be imported:", JSON.stringify(mockData, null, 2));
        const operations = mockData.map(item => ({
            updateOne: {
                filter: { pcb_serial: item.pcb_serial },
                update: { $setOnInsert: item },
                upsert: true
            }
        }));

        const result = await Data.bulkWrite(operations, { ordered: false });
        console.log('Bulk operation success:', result);

        mongoose.disconnect();
        console.log('MongoDB Disconnected');
    } catch (error) {
        console.error('Error during import:', error);
        mongoose.disconnect();
    }
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        return importData();
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
