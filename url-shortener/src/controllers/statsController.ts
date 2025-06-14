import e, { Request, Response } from 'express';
import { StatsService } from '../services/statsService';

class StatsController {
  static async getUrlStats(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;

      if (!shortCode || shortCode.trim() === '') {
        res.status(400).json({ error: 'shortCode parameter is required' });
      }

      const url = await StatsService.getUrlStats(shortCode);

      if (!url) {
        res.status(404).json({ error: 'URL not found' });
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

export default StatsController;