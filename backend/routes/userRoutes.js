const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Adjust the path according to your project structure
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate limiter configuration for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 5 login requests per `windowMs`
  message: 'Too many login attempts, please try again after 15 minutes'
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, unable to process the request due to invalid information
 */

//Post route for user registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check for missing fields
  if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



  /**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate a user and log them in
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

  
  //Post route for user login
  router.post('/login', loginLimiter, async (req, res) => {
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
  
      // Create token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  
      res.json({ message: 'User logged in successfully', token });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


  // Example of a GET route
router.get('/', (req, res) => {
  res.send('User data fetched successfully.');
});
  
  

  module.exports = router;
