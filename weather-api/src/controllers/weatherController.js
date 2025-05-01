'use strict'
const weatherService = require('../services/weatherService')

async function getWeather(req, res) {
  const { location } = req.params

  if (!location) {
    return res.status(400).json({ error: 'Location parameter is required' })
  }

  try {
    const weatherData = await weatherService.getWeatherData(location)
    res.json(weatherData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getWeather
}