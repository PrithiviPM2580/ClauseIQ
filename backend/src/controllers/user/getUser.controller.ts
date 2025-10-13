import logger from '@/lib/logger.lib';
import { getUserService } from '@/services/user.service';
import { successResponse } from '@/utils';
import type { NextFunction, Request, Response } from 'express';

const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    logger.warn('No user ID found in request');
    return next(new Error('User ID not found in request'));
  }

  const user = await getUserService(userId);

  logger.info(`User with ID ${userId} fetched successfully`);

  successResponse(res, { user }, 'User fetched successfully by ID', 200);
};

export default getUserController;
