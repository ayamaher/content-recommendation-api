import { Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Content } from '../models/Content';
import { Interaction } from '../models/Interaction';
import { In } from 'typeorm';

// Controller to get content recommendations based on user preferences
export const getRecommendations = async (req: Request, res: Response) => {
  // Extract userId from the query, ensuring it is a string
  const userId = Array.isArray(req.query.userId) ? req.query.userId[0] : req.query.userId;
  
  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ message: 'Invalid userId' });
    return;
  }

  try {
    // Fetch interactions for the user
    const interactionRepository = AppDataSource.getRepository(Interaction);
    const contentRepository = AppDataSource.getRepository(Content);

    // Find interactions based on userId
    const interactions = await interactionRepository.find({
      where: { userId: userId }  // userId is now guaranteed to be a string
    });

    if (interactions.length === 0) {
      res.status(404).json({ message: 'No interactions found for user' });
      return;
    }

    // Get tags from user interactions (this is a basic approach, could be refined)
    const userTags = interactions.map(interaction => interaction.type); // Simplified for example

    // Fetch content based on user tags (filtering content that matches user interests)
    const recommendedContent = await contentRepository.find({
      where: {
        tags: In(userTags), // In SQL query, filtering content by tags (e.g., "technology")
      },
    });

    res.status(200).json(recommendedContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};
