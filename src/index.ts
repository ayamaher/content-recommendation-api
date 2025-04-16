import express from 'express';
import { initializeDatabase, closeAllDatabaseConnections } from './database';
import routes from './routes';
// import { createSeedData } from './seeds/Seeder';

const app = express();
const port = 3000;

app.use(express.json());

// Initialize the database connection
closeAllDatabaseConnections();
initializeDatabase();

// Use routes for the API
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
