import { cookies } from '@/lib/cookie.lib';
import { logoutService } from '@/services/auth.service';
import { successResponse } from '@/utils';
import { APIError } from '@/lib/apiError.lib';
import type { NextFunction, Request, Response } from 'express';

const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || !req.user.userId) {
    return next(new APIError(401, 'User not authenticated'));
  }

  const { userId } = req.user;

  const isLoggedOut = await logoutService(userId);
  if (!isLoggedOut) {
    return next(new APIError(500, 'Failed to log out'));
  }

  cookies.clear(res, 'refreshToken');

  successResponse(res, null, 'User logged out successfully');
};

export default logoutController;
