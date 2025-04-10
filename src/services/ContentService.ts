import { AppDataSource } from '../database';
import { Content } from '../models/Content';  // Content model
import { In } from 'typeorm';

export const filterContentService = async (type: string, category: string) => {
  try {
    const contentRepository = AppDataSource.getRepository(Content);

    // Build the query object dynamically based on provided parameters
    let query: any = {};

    if (type) {
      query.type = type;  // Filter by content type (e.g., 'article', 'video')
    }

    if (category) {
      query.tags = In([category]);  // Filter by category (e.g., 'technology', 'health')
    }

    // Fetch filtered content from the database
    const filteredContent = await contentRepository.find({
      where: query,
    });

    return filteredContent;
  } catch (error) {
    console.error('Error in filterContentService:', error);
    throw error;  // Re-throw the error to be handled by the controller
  }
};
