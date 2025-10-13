import getUserController from '@/controllers/user/getUser.controller';
import asyncHandler from '@/middleware/asyncHandler.middleware';
import authenticate from '@/middleware/authentication.middleware';
import { limiters, rateLimiter } from '@/middleware/rateLimiter.middleware';
import { Router } from 'express';

const router = Router();

router.route('/me').get(
  rateLimiter(limiters.api, req => req.user?.userId?.toString() ?? 'aynomous'),
  authenticate(),
  asyncHandler(getUserController)
);

export default router;
