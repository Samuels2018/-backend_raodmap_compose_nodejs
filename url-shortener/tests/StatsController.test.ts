import { Request, Response } from 'express';
import StatsController from '../src/controllers/statsController';
import { StatsService } from '../src/services/statsService';
import { jest, describe, beforeEach, expect, it } from '@jest/globals';

// Mock the StatsService
jest.mock('../src/services/statsService');

const mockRequest = (params: any = {}): Request => ({
  params,
} as Request);

const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  (res.status as jest.Mock) = jest.fn().mockReturnValue(res);
  (res.json as jest.Mock) = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('StatsController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
  });

  describe('getUrlStats', () => {
    it('should return 404 if URL not found', async () => {
      (StatsService.getUrlStats as jest.Mock<any>).mockResolvedValue(null);
      req.params = { shortCode: 'nonexistent' };
      
      await StatsController.getUrlStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'URL not found' });
      expect(StatsService.getUrlStats).toHaveBeenCalledWith('nonexistent');
    });

    it('should return URL stats with access count if found', async () => {
      const mockUrl = {
        _id: '123',
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date(),
        accessCount: 42
      };
      
      (StatsService.getUrlStats  as jest.Mock<any>).mockResolvedValue(mockUrl);
      req.params = { shortCode: 'abc123' };
      
      await StatsController.getUrlStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: '123',
        url: 'https://example.com',
        shortCode: 'abc123',
        createdAt: mockUrl.createdAt,
        updatedAt: mockUrl.updatedAt,
        accessCount: 42
      });
      expect(StatsService.getUrlStats).toHaveBeenCalledWith('abc123');
    });

    it('should return 500 if service throws error', async () => {
      const errorMessage = 'Database connection failed';
      (StatsService.getUrlStats as jest.Mock<any>).mockRejectedValue(new Error(errorMessage));
      req.params = { shortCode: 'abc123' };
      
      await StatsController.getUrlStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
      expect(StatsService.getUrlStats).toHaveBeenCalledWith('abc123');
    });

    it('should handle empty shortCode parameter', async () => {
      req.params = { shortCode: '' };
      
      await StatsController.getUrlStats(req, res);
      
      // Asume que el servicio maneja códigos vacíos y devuelve null
      expect(StatsService.getUrlStats).toHaveBeenCalledWith('');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'shortCode parameter is required' });
    });

    it('should handle undefined shortCode parameter', async () => {
      req.params = {}; // shortCode no definido
      
      await StatsController.getUrlStats(req, res);
      
      // Verifica el comportamiento con shortCode undefined
      expect(StatsService.getUrlStats).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'shortCode parameter is required' });
    });
  
  });

});
