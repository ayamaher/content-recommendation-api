import { AppDataSource } from '../database';
import { Content } from '../models/Content';
import { User } from '../models/User';
import { PaginatedResponse, PaginationOptions } from '../types/pagination';

export class RecommendationService {
  async getRecommendations(userId: string,  pagination?: PaginationOptions): Promise<PaginatedResponse<Content>> {
    const { page = 1, limit = 10 } = pagination || {};

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      select: ['id', 'username', 'preferences']
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    const skip = (page - 1) * limit;
    const allContents = await AppDataSource.getRepository(Content)
      .find({ 
        order: { 
          popularity: 'DESC',
          createdAt: 'DESC' 
        } 
      });
  
    const recommendations = allContents
      .map(content => ({
        ...content,
        score: content.tags.filter(tag => 
          user.preferences.includes(tag)
        ).length
      }))
      .sort((a, b) => b.score - a.score || b.popularity - a.popularity)
      .slice(skip, skip + limit);
  
    const total = allContents.length;
    return {
      user: {
        id: user.id,
        username: user.username,
        preferences: user.preferences
      },
      data: recommendations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
