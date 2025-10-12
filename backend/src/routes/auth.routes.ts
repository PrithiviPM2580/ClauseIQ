import signupController from '@/controllers/auth/sign-up.controller';
import asyncHandler from '@/middleware/asyncHandler.middleware';
import { limiters, rateLimiter } from '@/middleware/rateLimiter.middleware';
import validateRequest from '@/middleware/validateRequest.middleware';
import { registerValidationSchema } from '@/validation/auth.validation';
import { Router } from 'express';

const router = Router();

router.route('/sign-up').post(
  rateLimiter(limiters.auth, req => req.ip as string),
  validateRequest({ body: registerValidationSchema }),
  asyncHandler(signupController)
);

export default router;
