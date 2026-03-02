import { Router } from 'express';
import aiRoutes from './ai';
import feedbackRoutes from './feedback';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Marriage API v1' });
});

router.use('/ai', aiRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
