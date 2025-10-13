import { googleCallbackController } from '@/controllers/auth/google.controller';
import loginController from '@/controllers/auth/login.controller';
import logoutController from '@/controllers/auth/logout.controller';
import refreshTokenController from '@/controllers/auth/refresh-token.controller';
import signupController from '@/controllers/auth/sign-up.controller';
import asyncHandler from '@/middleware/asyncHandler.middleware';
import authenticate from '@/middleware/authentication.middleware';
import { limiters, rateLimiter } from '@/middleware/rateLimiter.middleware';
import validateRequest from '@/middleware/validateRequest.middleware';
import {
  loginValidationSchema,
  registerValidationSchema,
} from '@/validation/auth.validation';
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.route('/sign-up').post(
  rateLimiter(limiters.auth, req => req.ip as string),
  validateRequest({ body: registerValidationSchema }),
  asyncHandler(signupController)
);

router.route('/login').post(
  rateLimiter(limiters.auth, req => req.ip as string),
  validateRequest({ body: loginValidationSchema }),
  asyncHandler(loginController)
);

router.route('/logout').delete(
  rateLimiter(limiters.auth, req => req.ip as string),
  authenticate(),
  asyncHandler(logoutController)
);

router.route('/refresh-token').post(
  rateLimiter(limiters.auth, req => req.ip as string),
  asyncHandler(refreshTokenController)
);

router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/google/callback').get(
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/v1/auth/google/failure',
  }),
  googleCallbackController
);

export default router;
