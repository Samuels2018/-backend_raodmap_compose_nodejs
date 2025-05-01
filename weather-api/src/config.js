'use strict'
require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  weatherApiKey: process.env.WEATHER_API_KEY,
  redisUrl: process.env.REDIS_URL,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100
  },
  cacheExpiration: parseInt(process.env.CACHE_EXPIRATION_SECONDS) || 43200
}