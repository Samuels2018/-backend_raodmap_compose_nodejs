import { Request, Response } from 'express';
import UrlController from '../src/controllers/urlController';
import { UrlService } from '../src/services/urlService';
import { jest, describe, beforeEach, expect, it} from '@jest/globals';

// Mock the UrlService
jest.mock('../src/services/urlService');

const mockRequest = (body: any = {}, params: any = {}): Request => ({
  body,
  params,
} as Request);

const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  (res.status as jest.Mock) = jest.fn().mockReturnValue(res);
  (res.json as jest.Mock) = jest.fn().mockReturnValue(res);
  (res.send as jest.Mock) = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('UrlController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
  });

  describe('createShortUrl', () => {
    it('should return 400 if URL is missing', async () => {
      req.body = {};
      await UrlController.createShortUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'URL is required' });
    });

    it('should create short URL and return 201 with data', async () => {
      const mockUrl = {
        _id: '123',
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (UrlService.createShortUrl as jest.Mock<any>).mockResolvedValue(mockUrl);
      req.body = { url: 'https://example.com' };
      
      await UrlController.createShortUrl(req, res);
      
      expect(UrlService.createShortUrl).toHaveBeenCalledWith('https://example.com');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: '123',
        url: 'https://example.com',
        shortCode: 'abc123',
        createdAt: mockUrl.createdAt,
        updatedAt: mockUrl.updatedAt
      });
    });

    it('should return 400 if service throws error', async () => {
      (UrlService.createShortUrl as jest.Mock<any>).mockRejectedValue(new Error('Invalid URL'));
      req.body = { url: 'invalid-url' };
      
      await UrlController.createShortUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid URL' });
    });
  });

  describe('getOriginalUrl', () => {
    it('should return 404 if URL not found', async () => {
      (UrlService.getOriginalUrl as jest.Mock<any>).mockResolvedValue(null);
      req.params = { shortCode: 'nonexistent' };
      
      await UrlController.getOriginalUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'URL not found' });
    });

    it('should return URL data if found', async () => {
      const mockUrl = {
        _id: '123',
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (UrlService.getOriginalUrl as jest.Mock<any>).mockResolvedValue(mockUrl);
      req.params = { shortCode: 'abc123' };
      
      await UrlController.getOriginalUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: '123',
        url: 'https://example.com',
        shortCode: 'abc123',
        createdAt: mockUrl.createdAt,
        updatedAt: mockUrl.updatedAt
      });
    });

    it('should return 500 if service throws error', async () => {
      (UrlService.getOriginalUrl as jest.Mock<any>).mockRejectedValue(new Error('DB error'));
      req.params = { shortCode: 'abc123' };
      
      await UrlController.getOriginalUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('updateUrl', () => {
    it('should return 400 if URL is missing', async () => {
      req.params = { shortCode: 'abc123' };
      req.body = {};
      
      await UrlController.updateUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'URL is required' });
    });

    it('should return 404 if URL not found', async () => {
      (UrlService.updateUrl as jest.Mock<any>).mockResolvedValue(null);
      req.params = { shortCode: 'nonexistent' };
      req.body = { url: 'https://new-url.com' };
      
      await UrlController.updateUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'URL not found' });
    });

    it('should update URL and return updated data', async () => {
      const mockUrl = {
        _id: '123',
        originalUrl: 'https://new-url.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (UrlService.updateUrl as jest.Mock<any>).mockResolvedValue(mockUrl);
      req.params = { shortCode: 'abc123' };
      req.body = { url: 'https://new-url.com' };
      
      await UrlController.updateUrl(req, res);
      
      expect(UrlService.updateUrl).toHaveBeenCalledWith('abc123', 'https://new-url.com');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: '123',
        url: 'https://new-url.com',
        shortCode: 'abc123',
        createdAt: mockUrl.createdAt,
        updatedAt: mockUrl.updatedAt
      });
    });

    it('should return 400 if service throws error', async () => {
      (UrlService.updateUrl as jest.Mock<any>).mockRejectedValue(new Error('Invalid URL'));
      req.params = { shortCode: 'abc123' };
      req.body = { url: 'invalid-url' };
      
      await UrlController.updateUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid URL' });
    });
  });

  describe('deleteUrl', () => {
    it('should return 404 if URL not found', async () => {
      (UrlService.getOriginalUrl as jest.Mock<any>).mockResolvedValue(null);
      req.params = { shortCode: 'nonexistent' };
      
      await UrlController.deleteUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'URL not found' });
    });

    it('should delete URL and return 204', async () => {
      const mockUrl = {
        _id: '123',
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (UrlService.getOriginalUrl as jest.Mock<any>).mockResolvedValue(mockUrl);
      req.params = { shortCode: 'abc123' };
      
      await UrlController.deleteUrl(req, res);
      
      expect(UrlService.deleteUrl).toHaveBeenCalledWith('abc123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 500 if service throws error', async () => {
      (UrlService.getOriginalUrl as jest.Mock<any>).mockResolvedValue({});
      (UrlService.deleteUrl as jest.Mock<any>).mockRejectedValue(new Error('DB error'));
      req.params = { shortCode: 'abc123' };
      
      await UrlController.deleteUrl(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });
});