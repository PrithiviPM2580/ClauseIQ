import { cookies } from '@/lib/cookie.lib';
import { loginService } from '@/services/auth.service';
import { successResponse } from '@/utils';
import { Login } from '@/validation/auth.validation';
import type { Request, Response } from 'express';

const loginController = async (req: Request, res: Response): Promise<void> => {
  const { user, refreshToken, accessToken } = await loginService(
    req.body as Login
  );

  cookies.set(res, 'refreshToken', refreshToken);

  successResponse(res, { user, accessToken }, 'User logged in successfully');
};

export default loginController;
