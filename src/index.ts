import express from 'express';
import { initializeDatabase, closeAllDatabaseConnections } from './database';
import routes from './routes';
import { errors } from 'celebrate'; // Celebrate validation error handler
// import { createSeedData } from './seeds/Seeder';
const app = express();
const port = 3000;

app.use(express.json());

// Initialize the database connection
closeAllDatabaseConnections()
initializeDatabase();

// Use routes for the API
app.use('/api', routes);

// Error handling middleware
app.use(errors());  // Celebrate's error handling
 
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
