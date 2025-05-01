'use strict'
const weatherController = require('../src/controllers/weatherController')
const weatherService = require('../src/services/weatherService')

// Mock the weather service
jest.mock('../src/services/weatherService')

describe('Weather Controller', () => {
  let mockRequest, mockResponse

  beforeEach(() => {
    // Create fresh mocks for each test
    mockRequest = {
      params: {}
    }
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    
    // Clear all mocks between tests
    jest.clearAllMocks()
  })

  describe('getWeather', () => {
    it('should return 400 error if location is missing', async () => {
      // Arrange
      mockRequest.params.location = undefined

      // Act
      await weatherController.getWeather(mockRequest, mockResponse)

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Location parameter is required'
      })
    })

    it('should return 400 error if location is empty string', async () => {
      // Arrange
      mockRequest.params.location = '   '

      // Act
      await weatherController.getWeather(mockRequest, mockResponse)

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Location parameter is required'
      })
    })

    it('should call weatherService with location parameter', async () => {
      // Arrange
      const testLocation = 'London'
      mockRequest.params.location = testLocation
      weatherService.getWeatherData.mockResolvedValue({ temperature: 15 })

      // Act
      await weatherController.getWeather(mockRequest, mockResponse)

      // Assert
      expect(weatherService.getWeatherData).toHaveBeenCalledWith(testLocation)
    })

    it('should return weather data with 200 status when successful', async () => {
      // Arrange
      const testLocation = 'Paris'
      const mockWeatherData = { temperature: 22, conditions: 'Sunny' }
      mockRequest.params.location = testLocation
      weatherService.getWeatherData.mockResolvedValue(mockWeatherData)

      // Act
      await weatherController.getWeather(mockRequest, mockResponse)

      // Assert
      expect(mockResponse.status).not.toHaveBeenCalled() // defaults to 200
      expect(mockResponse.json).toHaveBeenCalledWith(mockWeatherData)
    })

    it('should return 500 error when weatherService throws an error', async () => {
      // Arrange
      const testLocation = 'InvalidLocation'
      const errorMessage = 'API Error'
      mockRequest.params.location = testLocation
      weatherService.getWeatherData.mockRejectedValue(new Error(errorMessage))

      // Act
      await weatherController.getWeather(mockRequest, mockResponse)

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: errorMessage
      })
    })

    it('should handle special characters in location parameter', async () => {
      // Arrange
      const testLocation = 'São Paulo'
      mockRequest.params.location = testLocation
      weatherService.getWeatherData.mockResolvedValue({ temperature: 25 })

      // Act
      await weatherController.getWeather(mockRequest, mockResponse)

      // Assert
      expect(weatherService.getWeatherData).toHaveBeenCalledWith(testLocation)
    })

    it('should return API error message when available', async () => {
      // Arrange
      const testLocation = 'InvalidPlace'
      const apiErrorMessage = 'Location not found'
      mockRequest.params.location = testLocation
      weatherService.getWeatherData.mockRejectedValue(new Error(apiErrorMessage))

      // Act
      await weatherController.getWeather(mockRequest, mockResponse)

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: apiErrorMessage
      })
    })
  })
})