import { cookies } from '@/lib/cookie.lib';
import logger from '@/lib/logger.lib';
import { googleService } from '@/services/auth.service';
import { successResponse } from '@/utils';
import type { Request, Response } from 'express';

export const googleLogin = (_req: Request, res: Response) => {
  res.redirect('/');
};

export const googleCallbackController = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    logger.error('Google authentication failed: No user returned');
    return res.redirect('/api/v1/auth/google/failure');
  }

  const { userId, accessToken, refreshToken } = await googleService(user);

  cookies.set(res, 'refreshToken', refreshToken);

  logger.info(`User logged in with Google: ${userId}`);
  successResponse(
    res,
    { userId, accessToken, refreshToken },
    'User logged in with Google successfully'
  );
};
