import { Router } from 'express';
import path from 'path';
import authRoute from '@/routes/auth.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'ClauseIQ API is running',
    version: '1.0.0',
    docs: '/docs',
    status: 'success',
  });
});

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use('/api/v1/auth', authRoute);

// Catch-all route for SPA - only for non-API routes
router.use((req, res, next) => {
  // If it's an API route, let it fall through to 404
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // For all other routes, serve the SPA
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default router;
