import { AppDataSource } from '../database';
import { Content } from '../models/Content';
import { In, Like } from 'typeorm';
import { FilterContentDto } from '../validation/contentFilterValidation';

export const filterContentService = async (filter: FilterContentDto) => {
  try {
    const { page = 1, limit = 10, type, category } = filter;
    const skip = (page - 1) * limit;
    const contentRepository = AppDataSource.getRepository(Content);

    // Build query conditions
    const where: any = {};
    if (type) where.type = type;
    if (category) where.tags = In([category]);

    // Get paginated results
    const [contents, total] = await contentRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      data: contents,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in filterContentService:', error);
    throw error;
  }
};