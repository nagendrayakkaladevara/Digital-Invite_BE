import { Router, Request, Response } from 'express';
import { getAIResponse } from '../services/aiService';

const router = Router();

interface AIRequestBody {
  model: string;
  question: string;
}

router.post('/chat', async (req: Request, res: Response) => {
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
    const err = error as Error;
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
    console.error('AI chat error:', err);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

export default router;
