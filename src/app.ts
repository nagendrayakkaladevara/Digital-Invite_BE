import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import apiRoutes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB is connected (serverless: runs on cold start, cached thereafter)
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api', apiRoutes);

export default app;
