import { Url, IUrl } from '../models/urlModel';
import { generateShortCode } from '../utils/generateShortCode';
import validUrl from 'valid-url';

export class UrlService {
  static async createShortUrl(originalUrl: string): Promise<IUrl> {
    if (!validUrl.isUri(originalUrl)) {
      throw new Error('Invalid URL');
    }

    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return existingUrl;
    }

    let shortCode = generateShortCode();
    let existingCode = await Url.findOne({ shortCode });

    // Ensure shortCode is unique (very unlikely collision but just in case)
    while (existingCode) {
      shortCode = generateShortCode();
      existingCode = await Url.findOne({ shortCode });
    }

    const url = new Url({
      originalUrl,
      shortCode,
    });

    return await url.save();
  }

  static async getOriginalUrl(shortCode: string): Promise<IUrl | null> {
    const url = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { accessCount: 1 } },
      { new: true }
    );
    return url;
  }

  static async updateUrl(shortCode: string, newOriginalUrl: string): Promise<IUrl | null> {
    if (!validUrl.isUri(newOriginalUrl)) {
      throw new Error('Invalid URL');
    }

    const updatedUrl = await Url.findOneAndUpdate(
      { shortCode },
      { originalUrl: newOriginalUrl },
      { new: true }
    );

    return updatedUrl;
  }

  static async deleteUrl(shortCode: string): Promise<void> {
    await Url.findOneAndDelete({ shortCode });
  }
}