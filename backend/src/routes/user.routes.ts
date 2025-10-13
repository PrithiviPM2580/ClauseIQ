import deleteUserController from '@/controllers/user/deleteUser.controller';
import getUserController from '@/controllers/user/getUser.controller';
import updateUserController from '@/controllers/user/updateUser.controller';
import asyncHandler from '@/middleware/asyncHandler.middleware';
import authenticate from '@/middleware/authentication.middleware';
import { limiters, rateLimiter } from '@/middleware/rateLimiter.middleware';
import validateRequest from '@/middleware/validateRequest.middleware';
import { updateValidationSchema } from '@/validation/user.validation';
import { Router } from 'express';

const router = Router();

router.route('/me').get(
  rateLimiter(limiters.api, req => req.user?.userId?.toString() ?? 'aynomous'),
  authenticate(),
  asyncHandler(getUserController)
);

router.route('/me').get(
  rateLimiter(limiters.api, req => req.user?.userId?.toString() ?? 'aynomous'),
  validateRequest({ body: updateValidationSchema }),
  authenticate(),
  asyncHandler(updateUserController)
);

router.route('/me').delete(
  rateLimiter(limiters.api, req => req.user?.userId?.toString() ?? 'aynomous'),
  validateRequest({ body: updateValidationSchema }),
  authenticate(),
  asyncHandler(deleteUserController)
);

export default router;
