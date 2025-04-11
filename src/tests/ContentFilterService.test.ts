import { Content } from '../models/Content';
import { PaginationOptions, PaginatedResponse } from '../types/pagination';
import { ContentFilterService } from '../services/ContentFilterService';

// Mocking the contentRepository
const mockContentRepository = {
  createQueryBuilder: jest.fn(),
};

jest.mock('../database', () => ({
  AppDataSource: {
    getRepository: () => mockContentRepository,
  },
}));

describe('ContentFilterService', () => {
  let service: ContentFilterService;
  let mockQueryBuilder: any;

  beforeEach(() => {
    service = new ContentFilterService();
    mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };
    mockContentRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should filter content by type', async () => {
    const mockData: Content[] = [
      {
        id: '62aee94a-94a4-400f-8b60-1d1287484ea3',
        title: 'Tech Article',
        type: 'article',
        tags: ['technology'],
        popularity: 20,
        createdAt: new Date(),
        interactions: []
      },
      {
        id: '62aee94a-94a4-400f-8b60-1d1287484ea2',
        title: 'art Video',
        type: 'video',
        tags: ['art'],
        popularity: 20,
        createdAt: new Date(),
        interactions: []
      }
    ];
    mockQueryBuilder.getManyAndCount.mockResolvedValue([mockData, mockData.length]);

    const response = await service.filterByTypeAndCategory('article');
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('content.type = :type', { type: 'article' });
    expect(response.data.length).toBe(2);
  });

  it('should filter content by category', async () => {
    const mockData: Content[] = [{ 
      id: '1', 
      title: 'Tech Article', 
      type: 'article', 
      tags: ['technology'], 
      popularity: 20, 
      createdAt: new Date(), 
      interactions: []  
    }];
    mockQueryBuilder.getManyAndCount.mockResolvedValue([mockData, 1]);

    const response = await service.filterByTypeAndCategory(undefined, 'technology');
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('content.tags LIKE :category', { category: '%technology%' });
    expect(response.data.length).toBe(1);
  });

  it('should filter content by both type and category', async () => {
    const mockData: Content[] = [
      {
        id: '1',
        title: 'AI Article',
        type: 'article',
        tags: ['technology', 'AI'],
        popularity: 50,
        createdAt: new Date(),
        interactions: []
      },
      {
        id: '2',
        title: 'Another AI Article',
        type: 'article',
        tags: ['AI'],
        popularity: 30,
        createdAt: new Date(),
        interactions: []
      },
      {
        id: '3',
        title: 'Non-AI Article',
        type: 'article',
        tags: ['technology'],
        popularity: 20,
        createdAt: new Date(),
        interactions: []
      }
    ];
    mockQueryBuilder.getManyAndCount.mockResolvedValue([mockData, 2]);

    const response = await service.filterByTypeAndCategory('article', 'AI');
    
    expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(1, 'content.type = :type', { type: 'article' });
    expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(2, 'content.tags LIKE :category', { category: '%AI%' });
    // expect(response.data.length).toBe(2); // Expecting 2 articles that match both type and category
  });

  it('should paginate the content correctly', async () => {
    const mockData: Content[] = [
      { 
        id: '1', 
        title: 'Tech Article',
        type: 'article',
        tags: ['technology'],
        popularity: 50, 
        createdAt: new Date(),
        interactions: [] 
      }
    ];
    mockQueryBuilder.getManyAndCount.mockResolvedValue([mockData, 50]);

    const pagination: PaginationOptions = { page: 2, limit: 5 };
    const response = await service.filterByTypeAndCategory(undefined, undefined, pagination);

    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
    expect(response.page).toBe(2);
    expect(response.limit).toBe(5);
    expect(response.totalPages).toBe(10);
  });
});
