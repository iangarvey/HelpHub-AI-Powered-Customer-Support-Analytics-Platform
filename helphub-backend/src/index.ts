// The entry point of the application. Bootstraps and starts the server.

import app from './app.js';
import { connectDatabase } from './db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`HelpHub backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();