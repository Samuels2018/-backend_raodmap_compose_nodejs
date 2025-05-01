'use strict'
const express = require('express')
const cors = require('cors')
const config = require('./src/config')
const weatherController = require('./src/controllers/weatherController')
const rateLimiter = require('./src/middlewares/rateLimiter')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(rateLimiter)

// Routes
app.get('/weather/:location', weatherController.getWeather);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(config.port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Weather API running on port ${config.port}`);
});