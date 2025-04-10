import express from 'express';
import { recordInteraction } from '../controllers/InteractionsController';
import { getRecommendations } from '../controllers/RecommendationsController';
import { filterContent } from '../controllers/ContentController';
import { CreateInteractionDto } from '../validation/interactionsValidation';
// import { recommendationsSchema } from '../validation/recommendationsValidation';
import { FilterContentDto } from '../validation/contentFilterValidation';
import { validateDto } from '../middlewares/validationMiddleware';

const router = express.Router();

// POST /interactions - Record interaction
router.post('/interactions', validateDto(CreateInteractionDto, 'body'), recordInteraction);

// GET /recommendations - Get recommendations based on userId
// router.get('/recommendations', celebrate({
//   [Segments.QUERY]: recommendationsSchema  // Apply schema to query params
// }), getRecommendations);

// GET /content/filter - Filter content by type and category
router.get('/content/filter', validateDto(FilterContentDto, 'query'), filterContent);

export default router;

