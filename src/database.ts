import { DataSource } from 'typeorm';
import { User } from './models/User';
import { Content } from './models/Content';
import { Interaction } from './models/Interaction';

export class Database {
  private static instance: DataSource;
  private static isInitialized = false;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;

  private constructor() {}

  public static getInstance(): DataSource {
    if (!Database.instance) {
      Database.instance = new DataSource({
        type: 'sqlite',
        database: 'content_recommendation.db',
        synchronize: true,
        logging: true,
        entities: [User, Content, Interaction],
        extra: {
          // SQLite performance and locking optimizations
          busyTimeout: 10000, // Increased to 10 seconds
          pragmas: {
            journal_mode: 'WAL', // Better concurrency
            synchronous: 'NORMAL', // Balanced durability/performance
            foreign_keys: 'ON',
            temp_store: 'MEMORY'
          },
          pool: {
            max: 1,
            min: 1,
            idleTimeoutMillis: 30000,
            acquireTimeoutMillis: 30000
          },
          transactionType: 'IMMEDIATE' // Better write locking
        }
      });
    }
    return Database.instance;
  }

  public static async initialize(): Promise<DataSource> {
    if (Database.isInitialized) {
      console.log('Database already initialized');
      return Database.instance;
    }

    let retries = 0;
    while (retries < Database.MAX_RETRIES) {
      try {
        const dataSource = Database.getInstance();
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
          Database.isInitialized = true;
          console.log('Database connected successfully');
        }
        return dataSource;
      } catch (error: unknown) {
        retries++;
        if (error instanceof Error && 'code' in error && error.code === 'SQLITE_BUSY' && retries < Database.MAX_RETRIES) {
          console.log(`Database busy, retrying (${retries}/${Database.MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, Database.RETRY_DELAY));
          continue;
        }
        console.error('Error connecting to the database', error);
        throw error;
      }
    }
    throw new Error('Max retries reached for database connection');
  }

  public static async close(): Promise<void> {
    if (Database.instance && Database.isInitialized) {
      try {
        await Database.instance.destroy();
        Database.isInitialized = false;
        console.log('Database connection closed');
      } catch (error: unknown) {
        console.error('Error closing database connection', error instanceof Error ? error.message : String(error));
      }
    }
  }
}

// Maintain backward compatibility
export const AppDataSource = Database.getInstance();
export const initializeDatabase = Database.initialize;
export const closeAllDatabaseConnections = Database.close;
