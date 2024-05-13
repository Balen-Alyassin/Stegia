const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LoginEvent = require('../models/LoginEvent');

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

 // Record login event
    const loginEvent = new LoginEvent({
       userId: user._id,
       ipAddress: req.ip, 
       userAgent: req.get('User-Agent')
     });
     await loginEvent.save();


    const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '24h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
