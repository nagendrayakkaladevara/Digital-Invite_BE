import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { getAIResponse } from '../services/aiService';
import AIChatHistory from '../models/AIChatHistory';

const router = Router();

const chatLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

interface AIRequestBody {
  model: string;
  question: string;
}

router.get('/chat', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string, 10) || 20);
    const [records, total] = await Promise.all([
      AIChatHistory.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      AIChatHistory.countDocuments(),
    ]);
    res.json({ success: true, data: records, page, limit, total });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

router.post('/chat', chatLimiter, async (req: Request, res: Response) => {
  try {
    const { model, question } = req.body as AIRequestBody;

    if (!model || typeof model !== 'string') {
      res.status(400).json({ error: 'model is required and must be a string' });
      return;
    }

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'question is required and must be a string' });
      return;
    }

    if (question.trim().length === 0) {
      res.status(400).json({ error: 'question cannot be empty' });
      return;
    }

    if (question.trim().length > 2000) {
      res.status(400).json({ error: 'Question must be 2000 characters or fewer' });
      return;
    }

    const { response, savedRecord } = await getAIResponse(model, question.trim());

    res.json({
      success: true,
      data: {
        question: savedRecord.question,
        response,
        model: savedRecord.aiModel,
        id: savedRecord._id,
        createdAt: savedRecord.createdAt,
      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (err.message.includes('API_KEY') || err.message.includes('not configured')) {
      res.status(503).json({
        error: 'AI service temporarily unavailable',
        details: err.message,
      });
      return;
    }
    if (err.message.includes('Unknown model')) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err.message.includes('timed out')) {
      res.status(504).json({ error: 'AI service timed out, please try again' });
      return;
    }
    console.error('AI chat error:', err);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
});

export default router;
