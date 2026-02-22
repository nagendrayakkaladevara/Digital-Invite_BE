import { Router } from 'express';
import aiRoutes from './ai';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Marriage API v1' });
});

router.use('/ai', aiRoutes);

export default router;
