import { Interaction } from '../models/Interaction';
import { InteractionService } from '../services/InteractionService';
import { Repository } from 'typeorm';

// Mock the repository
const mockInteractionRepository = {
  save: jest.fn(),
  find: jest.fn()
};

// Mock the database connection
jest.mock('../database', () => ({
  AppDataSource: {
    getRepository: () => mockInteractionRepository
  }
}));

describe('InteractionService', () => {
  let service: InteractionService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InteractionService();
  });

  describe('save', () => {
    it('should successfully save a view interaction', async () => {
      const mockInteraction = {
        userId: 'user123',
        contentId: 'content456',
        type: 'view',
        timestamp: new Date()
      } as Interaction;

      mockInteractionRepository.save.mockResolvedValue(mockInteraction);

      const result = await service.save('user123', 'content456', 'view');

      expect(mockInteractionRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockInteraction);
      expect(result.userId).toBe('user123');
      expect(result.contentId).toBe('content456');
      expect(result.type).toBe('view');
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.rating).toBeUndefined();
    });

    it('should successfully save a rating interaction with rating value', async () => {
      const mockInteraction = {
        userId: 'user123',
        contentId: 'content456',
        type: 'rate',
        rating: 5,
        timestamp: new Date()
      } as Interaction;

      mockInteractionRepository.save.mockResolvedValue(mockInteraction);

      const result = await service.save('user123', 'content456', 'rate', 5);

      expect(mockInteractionRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockInteraction);
      expect(result.userId).toBe('user123');
      expect(result.contentId).toBe('content456');
      expect(result.type).toBe('rate');
      expect(result.rating).toBe(5);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

});
