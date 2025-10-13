import logger from '@/lib/logger.lib';
import { deleteUserService } from '@/services/user.service';
import { successResponse } from '@/utils';
import { Request, Response, NextFunction } from 'express';

const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    logger.error('No user ID found in request');
    return next(new Error('User ID not found in request'));
  }

  const deletedUser = await deleteUserService(userId);

  logger.info(`User with ID ${userId} deleted successfully`);

  successResponse(res, { user: deletedUser }, 'User deleted successfully', 200);
};

export default deleteUserController;
