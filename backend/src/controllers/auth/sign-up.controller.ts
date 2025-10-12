import { cookies } from '@/lib/cookie.lib';
import { signUpService } from '@/services/auth.service';
import { successResponse } from '@/utils';
import { Register } from '@/validation/auth.validation';
import type { Request, Response } from 'express';

const signupController = async (req: Request, res: Response): Promise<void> => {
  const { user, accessToken, refreshToken } = await signUpService(
    req.body as Register
  );

  cookies.set(res, 'refreshToken', refreshToken);

  successResponse(res, { user, accessToken }, 'User registered successfully');
};

export default signupController;
