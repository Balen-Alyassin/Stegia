// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const dataRoutes = require('./routes/dataRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});

// Apply to all requests
app.use(limiter);

// CORS configuration for frontend origin
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes);  

// Establish connection to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    
})
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log("Error connecting to MongoDB:", err));

// Start the server only if the file is being run directly
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
