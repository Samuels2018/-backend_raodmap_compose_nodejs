import { Request, Response } from 'express';
import { StatsService } from '../services/statsService';

export class StatsController {
  static async getUrlStats(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      const url = await StatsService.getUrlStats(shortCode);

      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }

      res.status(200).json({
        id: url._id,
        url: url.originalUrl,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
        accessCount: url.accessCount,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}