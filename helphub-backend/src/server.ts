import app from './app.js';
import pool from './config/database.js';

const PORT = process.env.PORT || 3000;

// Test database connection on startup
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await testDatabaseConnection();
  
  app.listen(PORT, () => {
    console.log(`HelpHub backend server running on port ${PORT}`);
  });
};

startServer();