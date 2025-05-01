import { Url, IUrl } from '../models/urlModel';

export class StatsService {
  static async getUrlStats(shortCode: string): Promise<IUrl | null> {
    const url = await Url.findOne({ shortCode });
    return url;
  }
}