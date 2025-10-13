import logger from '@/lib/logger.lib';
import { updateUserService } from '@/services/user.service';
import { successResponse } from '@/utils';
import { UpdateUserBody } from '@/validation/user.validation';
import type { NextFunction, Request, Response } from 'express';

const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    logger.error('No user ID found in request');
    return next(new Error('User ID not found in request'));
  }

  const updatedUser = await updateUserService(
    req.body as UpdateUserBody,
    userId
  );

  logger.info(`User with ID ${userId} updated successfully`);

  successResponse(res, { user: updatedUser }, 'User updated successfully', 200);
};

export default updateUserController;
