import Joi from 'joi';

export const contentFilterSchema = Joi.object({
  type: Joi.string().valid('article', 'video', 'image', 'podcast').optional(),
  category: Joi.string().optional(),
});
