const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API for managing users',
      contact: {
        name: 'API Support',
        url: 'http://stegia.com',
        email: 'support@stegia.com'
      }
    },
    servers: [{
      url: 'http://localhost:5000',
      description: 'Stegia AB server'
    }]
  },
  apis: ['./routes/*.js'], //  check this path (Balen)
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
