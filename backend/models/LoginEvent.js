//LoginEvent.js
const mongoose = require('mongoose');

const loginEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'LoginDemo' }); // Specify the collection name here

const LoginEvent = mongoose.model('LoginEvent', loginEventSchema);

module.exports = LoginEvent;
