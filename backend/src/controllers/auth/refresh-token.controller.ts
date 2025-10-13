import { APIError } from '@/lib/apiError.lib';
import { cookies } from '@/lib/cookie.lib';
import { refreshTokenService } from '@/services/auth.service';
import { successResponse } from '@/utils';
import type { NextFunction, Request, Response } from 'express';

const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = cookies.get(req, 'refreshToken');
  console.log('Refresh Token:', refreshToken);
  if (!refreshToken) {
    return next(new APIError(401, 'No refresh token provided'));
  }

  const { newAccessToken, newRefreshToken } =
    await refreshTokenService(refreshToken);

  cookies.set(res, 'refreshToken', newRefreshToken);

  successResponse(
    res,
    { accessToken: newAccessToken },
    'Token refreshed successfully',
    200
  );
};

export default refreshTokenController;
