import { Request, Response } from 'express';
import { filterContentService } from '../services/ContentService';

export const filterContent = async (req: Request, res: Response): Promise<void> => {
  const { type, category } = req.query;

  try {
    // Call the service to filter content based on type or category
    const filteredContent = await filterContentService(type as string, category as string);

    if (filteredContent.length === 0) {
      res.status(404).json({ message: 'No content found matching the criteria' });
      return;
    }

    res.status(200).json(filteredContent); // Send back the filtered content as JSON
  } catch (error) {
    console.error('Error filtering content:', error);
    res.status(500).json({ message: 'Error filtering content' });
  }
};
