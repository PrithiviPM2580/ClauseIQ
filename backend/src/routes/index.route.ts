import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import authRoute from '@/routes/auth.routes';
import userRoute from '@/routes/user.routes';

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
router.use('/api/v1/users', userRoute);

// Catch-all route for SPA - only for non-API routes
router.use((req, res, next) => {
  // If it's an API route, let it fall through to 404
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // Check if index.html exists before trying to serve it
  const indexPath = path.join(__dirname, '../public/index.html');

  if (fs.existsSync(indexPath)) {
    // File exists, serve the SPA
    res.sendFile(indexPath);
  } else {
    // File doesn't exist (development environment)
    res.status(404).json({
      message:
        'Frontend not built. This route will serve the SPA in production.',
      path: req.path,
      suggestion: 'Build your frontend and place dist files in backend/public/',
      note: 'In production, your CI/CD should copy frontend dist to backend/public/',
    });
  }
});

export default router;
