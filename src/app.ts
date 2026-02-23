import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import apiRoutes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json({ limit: '10kb' }));

// Ensure DB is connected (serverless: runs on cold start, cached thereafter)
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Root
app.get('/', (_req, res) => {
  res.json({
    message: 'Marriage API',
    endpoints: {
      health: 'GET /health',
      api: 'GET /api',
      aiChat: 'POST /api/ai/chat',
    },
  });
});

// Health check
app.get('/health', async (_req, res) => {
  try {
    await connectDB();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// API routes
app.use('/api', apiRoutes);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
