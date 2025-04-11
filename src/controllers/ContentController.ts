import { Request, Response } from 'express';
import { ContentFilterService } from '../services/ContentFilterService';

// Singleton pattern implementation
class ContentController {
  
  async filterContent(req: Request, res: Response) {
    const contentService = new ContentFilterService();
    try {
      const { type, category, page, limit } = req.query;
      const result = await contentService.filterByTypeAndCategory(
        type as string | undefined,
        category as string | undefined,
        {
          page: page ? Number(page) : 1,
          limit: limit ? Number(limit) : 10
        }
      );
      res.json(result);
    } catch (error) {

      res.status(500).json({ message: 'Error filtering content' });
    }
  }
}

// Export the singleton instance
export const contentController = new ContentController();
