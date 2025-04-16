import { Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Interaction } from '../models/Interaction';

export const recordInteraction = async (req: Request, res: Response) => {
  const { userId, contentId, type, rating } = req.body;

  try {
    const interactionRepository = AppDataSource.getRepository(Interaction);

    const interaction = new Interaction();
    interaction.userId = userId;
    interaction.contentId = contentId;
    interaction.type = type;
    interaction.timestamp = new Date();
    if (rating) interaction.rating = rating;

    await interactionRepository.save(interaction);

    res.status(201).json({ message: 'Interaction recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error recording interaction' });
  }
};
