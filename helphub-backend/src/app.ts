import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Basic test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'HelpHub backend is running', timestamp: new Date().toISOString() });
});

export default app;