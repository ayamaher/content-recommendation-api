import { RecommendationService } from '../services/RecommendationService';
import { GetRecommendationsDto } from '../validation/recommendationsValidation';
import { RequestHandler } from 'express-serve-static-core';

export class RecommendationsController {
  private recommendationService = new RecommendationService();

  getRecommendations: RequestHandler = async (req, res) => {
    try {
      const { userId, page = 1, limit = 10 } = req.query as unknown as GetRecommendationsDto;
  
      const result = await this.recommendationService.getRecommendations(
        userId,
        Number(page),
        Number(limit)
      );
  
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('RecommendationController error:', message);
      res.status(500).json({ 
        message: 'Internal server error while fetching recommendations' 
      });
    }
  };
}