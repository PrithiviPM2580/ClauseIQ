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
  try {
    // Debug: Log the request
    console.log('Logout request received');
    console.log('User from req:', req.user);

    if (!req.user || !req.user.userId) {
      throw new APIError(401, 'User not authenticated');
    }

    const { userId } = req.user;
    console.log('Logging out user:', userId);

    const isLoggedOut = await logoutService(userId);
    if (!isLoggedOut) {
      throw new APIError(500, 'Failed to log out');
    }

    cookies.clear(res, 'refreshToken');

    successResponse(res, null, 'User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    next(error);
  }
};

export default logoutController;
