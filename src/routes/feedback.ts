import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import Feedback from '../models/Feedback';

const router = Router();

const feedbackLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

interface FeedbackRequestBody {
  description?: string;
  number?: string;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string, 10) || 20);
    const [records, total] = await Promise.all([
      Feedback.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Feedback.countDocuments(),
    ]);
    res.json({ success: true, data: records, page, limit, total });
  } catch (error) {
    console.error('Feedback list error:', error);
    res.status(500).json({ error: 'Failed to retrieve feedback' });
  }
});

router.post('/', feedbackLimiter, async (req: Request, res: Response) => {
  try {
    const { description, number } = req.body as FeedbackRequestBody;

    const feedback = new Feedback({
      ...(description != null && String(description).trim() && {
        description: String(description).trim().slice(0, 2000),
      }),
      ...(number != null && String(number).trim() && {
        number: String(number).trim().slice(0, 50),
      }),
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      data: {
        id: feedback._id,
        description: feedback.description,
        number: feedback.number,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

export default router;
