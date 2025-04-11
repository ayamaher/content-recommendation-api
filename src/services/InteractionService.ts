import { AppDataSource } from '../database';
import { Interaction } from '../models/Interaction';
import { Repository } from 'typeorm';

export class InteractionService {
  private interactionRepository: Repository<Interaction>;

  constructor() {
    this.interactionRepository = AppDataSource.getRepository(Interaction);
  }

  async save(userId: string, contentId: string, type: string, rating?: number) {
    const interaction = new Interaction();
    interaction.userId = userId;
    interaction.contentId = contentId;
    interaction.type = type;
    interaction.timestamp = new Date();
    
    if (type === 'rate' && rating) {
      interaction.rating = rating;
    }

    return await this.interactionRepository.save(interaction);
  }

  async getInteractionsByUser(userId: string) {
    return await this.interactionRepository.find({ where: { userId } });
  }
}
