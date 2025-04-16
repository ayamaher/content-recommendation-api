import { AppDataSource } from '../database';
import { User } from '../models/User';
import { Content } from '../models/Content';
import { Interaction } from '../models/Interaction';
import { faker } from '@faker-js/faker';

// Initialize database connection
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection established');
    
    try {
      const userRepository = AppDataSource.getRepository(User);
      const contentRepository = AppDataSource.getRepository(Content);
      const interactionRepository = AppDataSource.getRepository(Interaction);
      const availableTags = [
        'technology',
        'science', 
        'health',
        'business',
        'entertainment',
        'sports',
        'politics',
        'education',
        'art',
        'travel'
      ];
      // 1. Create 10 Users
      const users = [];
      for (let i = 0; i < 10; i++) {
        const user = new User();
        user.id = faker.string.uuid();
        user.username = faker.string.alphanumeric(8);
        user.preferences = faker.helpers.arrayElements(availableTags, 2);
        users.push(user);
      }
      await userRepository.save(users);
      console.log('10 Users have been added.');

      // 2. Create 200 Content
      const contents = [];
      for (let i = 0; i < 200; i++) {
        const content = new Content();
        content.id = faker.string.uuid();
        content.title = faker.lorem.words(2);
        content.type = faker.helpers.arrayElement(['article', 'video', 'podcast', 'image']);
        
        content.tags = faker.helpers.arrayElements(availableTags, 3);
        content.popularity = faker.number.int({ min: 1, max: 1000 });
        content.createdAt = faker.date.past();
        contents.push(content);
      }
      await contentRepository.save(contents);
      console.log('200 Contents have been added.');

      // 3. Create 1000 Interactions
      const interactions = [];
      for (let i = 0; i < 1000; i++) {
        const interaction = new Interaction();
        interaction.id = faker.string.uuid();
        interaction.userId = faker.helpers.arrayElement(users).id;
        interaction.contentId = faker.helpers.arrayElement(contents).id;
        interaction.type = faker.helpers.arrayElement(['view', 'like', 'bookmark', 'rate']);
        interaction.timestamp = faker.date.past();
        interaction.rating = interaction.type === 'rate' ? faker.number.int({ min: 1, max: 5 }) : undefined;
        interactions.push(interaction);
      }

      await interactionRepository.save(interactions);
      console.log('1000 Interactions have been added.');
      console.log('Seeding complete!');
    } catch (error) {
      console.error('Error creating seed data:', error);
    } finally {
      await AppDataSource.destroy();
    }
  })
  .catch(error => console.log('Database connection error:', error));
