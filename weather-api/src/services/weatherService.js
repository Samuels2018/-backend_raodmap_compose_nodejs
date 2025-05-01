'use strict'
const axios = require('axios')
const config = require('../config')
const cache = require('../cache')

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'

async function getWeatherData(location) {
  // Check cache first
  const cachedData = await cache.get(location)
  if (cachedData) {
    console.log('Serving from cache')
    return cachedData
  }

  try {
    console.log('Fetching from API');
    const response = await axios.get(`${BASE_URL}/${encodeURIComponent(location)}`, {
      params: {
        unitGroup: 'metric',
        key: config.weatherApiKey,
        contentType: 'json'
      }
    })

    // Cache the data
    await cache.set(location, response.data, config.cacheExpiration)

    return response.data
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data')
  }
}

module.exports = {
  getWeatherData
}