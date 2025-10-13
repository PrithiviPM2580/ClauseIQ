import logger from '@/lib/logger.lib';
import { getUserService } from '@/services/user.service';
import { successResponse } from '@/utils';
import type { NextFunction, Request, Response } from 'express';

const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Debug logs
    console.log('=== /me endpoint hit ===');
    console.log('Headers:', req.headers);
    console.log('User from req:', req.user);
    console.log('User ID:', req.user?.userId);

    const userId = req.user?.userId;
    if (!userId) {
      console.log('No user ID found in request');
      return next(new Error('User ID not found in request'));
    }

    console.log('Fetching user with ID:', userId);
    const user = await getUserService(userId);
    console.log('User fetched:', user);

    logger.info(`User with ID ${userId} fetched successfully`);

    successResponse(res, { user }, 'User fetched successfully by ID', 200);
  } catch (error) {
    console.error('Error in getUserController:', error);
    next(error);
  }
};

export default getUserController;
