const mongoose = require('mongoose');
const { setupDB, seedDB, clearDB } = require('./seedFunctions'); 

exports.connect = async () => mongoose.connect(process.env.MONGO_URI);
exports.disconnect = async () => mongoose.disconnect();
exports.seedTestData = async () => await seedDB();
exports.clearDatabase = async () => await clearDB();
