import { Request, Response } from 'express';
import { filterContentService } from '../services/ContentService';
import { FilterContentDto } from '../validation/contentFilterValidation';

export const filterContent = async(req: Request, res: Response) => {
  try {
    const filter = req.validatedQuery as FilterContentDto;
    const result = await filterContentService(filter);
    res.json(result);
  } catch (error) {
    console.error('Error filtering content:', error);
    res.status(500).json({ message: 'Error filtering content' });
  }
}