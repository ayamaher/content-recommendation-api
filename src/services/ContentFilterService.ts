import { AppDataSource } from '../database';
import { Content } from '../models/Content';
import { Repository } from 'typeorm';
import { PaginationOptions, PaginatedResponse } from '../types/pagination';

export class ContentFilterService {
  private contentRepository: Repository<Content>;

  constructor() {
    this.contentRepository = AppDataSource.getRepository(Content);
  }

  async filterByTypeAndCategory(
    type?: string, 
    category?: string,
    pagination?: PaginationOptions
  ): Promise<PaginatedResponse<Content>> {
    const { page = 1, limit = 10 } = pagination || {};
    const query = this.contentRepository.createQueryBuilder('content');
    
    if (type) {
      query.andWhere('content.type = :type', { type });
    }
    if (category) {
      query.andWhere('content.tags LIKE :category', { category: `%${category}%` });
    }

    const [results, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
