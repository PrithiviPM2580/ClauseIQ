import { Router } from 'express';
import path from 'path';

const router = Router();

router.get('*name', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default router;
