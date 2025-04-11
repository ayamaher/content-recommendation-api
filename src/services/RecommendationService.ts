import { AppDataSource } from '../database';
import { Content } from '../models/Content';
import { User } from '../models/User';

export class RecommendationService {
  async getRecommendations(userId: string, page: number = 1, limit: number = 10) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      select: ['id', 'username', 'preferences']
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    const skip = (page - 1) * limit;
    const allContents = await AppDataSource.getRepository(Content)
      .find({ order: { popularity: 'DESC' } });
  
    const recommendations = allContents
      .map(content => ({
        ...content,
        score: content.tags.filter(tag => 
          user.preferences.includes(tag)
        ).length
      }))
      .sort((a, b) => b.score - a.score || b.popularity - a.popularity)
      .slice(skip, skip + limit);
  
    return {
      user: {
        id: user.id,
        username: user.username,
        preferences: user.preferences
      },
      recommendations,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: allContents.length,
        totalPages: Math.ceil(allContents.length / limit)
      }
    };
  }
}
