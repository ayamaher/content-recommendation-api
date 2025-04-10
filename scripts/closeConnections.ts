import { Database } from '../src/database';

(async () => {
  try {
    await Database.close();
    console.log('All database connections closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error closing connections:', error);
    process.exit(1);
  }
})();
