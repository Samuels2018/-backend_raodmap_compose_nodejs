import { Request, Response } from 'express';
import { UrlService } from '../services/urlService';

export class UrlController {
  static async createShortUrl(req: Request, res: Response) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      const shortUrl = await UrlService.createShortUrl(url);
      res.status(201).json({
        id: shortUrl._id,
        url: shortUrl.originalUrl,
        shortCode: shortUrl.shortCode,
        createdAt: shortUrl.createdAt,
        updatedAt: shortUrl.updatedAt,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getOriginalUrl(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      const url = await UrlService.getOriginalUrl(shortCode);

      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }

      res.status(200).json({
        id: url._id,
        url: url.originalUrl,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUrl(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      const { url: newUrl } = req.body;

      if (!newUrl) {
        return res.status(400).json({ error: 'URL is required' });
      }

      const updatedUrl = await UrlService.updateUrl(shortCode, newUrl);

      if (!updatedUrl) {
        return res.status(404).json({ error: 'URL not found' });
      }

      res.status(200).json({
        id: updatedUrl._id,
        url: updatedUrl.originalUrl,
        shortCode: updatedUrl.shortCode,
        createdAt: updatedUrl.createdAt,
        updatedAt: updatedUrl.updatedAt,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteUrl(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      const url = await UrlService.getOriginalUrl(shortCode);

      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }

      await UrlService.deleteUrl(shortCode);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}