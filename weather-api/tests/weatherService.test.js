'use strict'
const axios = require('axios')
const cache = require('../src/cache')
const weatherService = require('../src/services/weatherService')

jest.mock('axios')
jest.mock('../src/cache')

describe('Weather Service', () => {
  const mockWeatherData = {
    days: [{ datetime: '2023-05-01', temp: 20, conditions: 'Partly cloudy' }],
    address: 'New York'
  }

  const mockLocation = 'New York'
  const mockError = new Error('API Error')
  const mockApiResponse = { data: mockWeatherData }

  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks()
  })

  describe('getWeatherData', () => {
    it('should return cached data when available', async () => {
      // Arrange
      cache.get.mockResolvedValue(mockWeatherData)

      // Act
      const result = await weatherService.getWeatherData(mockLocation)

      // Assert
      expect(result).toEqual(mockWeatherData)
      expect(cache.get).toHaveBeenCalledWith(mockLocation)
      expect(cache.set).not.toHaveBeenCalled()
      expect(axios.get).not.toHaveBeenCalled()
    })

    it('should fetch from API and cache result when no cache is available', async () => {
      // Arrange
      cache.get.mockResolvedValue(null)
      axios.get.mockResolvedValue(mockApiResponse)

      // Act
      const result = await weatherService.getWeatherData(mockLocation)

      // Assert
      expect(result).toEqual(mockWeatherData)
      expect(cache.get).toHaveBeenCalledWith(mockLocation)
      expect(cache.set).toHaveBeenCalledWith(
        mockLocation,
        mockWeatherData,
        expect.any(Number)
      )
      expect(axios.get).toHaveBeenCalled()
    })

    it('should properly encode the location in the API request', async () => {
      // Arrange
      const locationWithSpaces = 'São Paulo'
      cache.get.mockResolvedValue(null)
      axios.get.mockResolvedValue(mockApiResponse)

      // Act
      await weatherService.getWeatherData(locationWithSpaces)

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('S%C3%A3o%20Paulo'),
        expect.any(Object)
      )
    })

    it('should include the correct query parameters in the API request', async () => {
      // Arrange
      cache.get.mockResolvedValue(null)
      axios.get.mockResolvedValue(mockApiResponse)

      // Act
      await weatherService.getWeatherData(mockLocation)

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        {
          params: {
            unitGroup: 'metric',
            key: expect.any(String),
            contentType: 'json'
          }
        }
      )
    })

    it('should throw an error when the API request fails', async () => {
      // Arrange
      cache.get.mockResolvedValue(null)
      axios.get.mockRejectedValue(mockError)

      // Act & Assert
      await expect(weatherService.getWeatherData(mockLocation))
        .rejects
        .toThrow('Failed to fetch weather data')
    })

    it('should throw an error with the API message when available', async () => {
      // Arrange
      const apiError = {
        response: {
          data: { message: 'Invalid location provided' }
        }
      }
      cache.get.mockResolvedValue(null)
      axios.get.mockRejectedValue(apiError)

      // Act & Assert
      await expect(weatherService.getWeatherData(mockLocation))
        .rejects
        .toThrow('Invalid location provided')
    })

    it('should log error details when API request fails', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const apiError = {
        response: { data: { message: 'Error' } },
        message: 'API Error'
      }
      cache.get.mockResolvedValue(null)
      axios.get.mockRejectedValue(apiError)

      try {
        // Act
        await weatherService.getWeatherData(mockLocation)
      } catch (error) {
        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(
          'Weather API error:',
          apiError.response.data
        )
      }

      // Cleanup
      consoleSpy.mockRestore()
    })
  })
})