import express from 'express';
import { recordInteraction } from '../controllers/InteractionsController';
import { RecommendationsController } from '../controllers/RecommendationsController';
import { filterContent } from '../controllers/ContentController';
import { CreateInteractionDto } from '../validation/interactionsValidation';
import { GetRecommendationsDto } from '../validation/recommendationsValidation';
import { FilterContentDto } from '../validation/contentFilterValidation';
import { validateDto } from '../middlewares/validationMiddleware';

const router = express.Router();

// POST /interactions - Record interaction
router.post('/interactions', validateDto(CreateInteractionDto, 'body'), recordInteraction);

const recommendationsController = new RecommendationsController();
// GET /recommendations - Get recommendations based on userId
router.get('/recommendations', validateDto(GetRecommendationsDto, 'query'), recommendationsController.getRecommendations);

// GET /content/filter - Filter content by type and category
router.get('/content/filter', validateDto(FilterContentDto, 'query'), filterContent);

export default router;

