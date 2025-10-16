import logger from '@/lib/logger.lib';
import { detectTypeService } from '@/services/contract.service';
import { successResponse } from '@/utils';
import type { Request, Response, NextFunction } from 'express';

const detectTypeContoller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    logger.error('User ID not found in request');
    return next(new Error('User not authenticated'));
  }

  const detectedType = await detectTypeService(req, userId);

  if (!detectedType) {
    logger.error('Failed to detect contract type');
    return next(new Error('Failed to detect contract type'));
  }

  successResponse(
    res,
    { contractType: detectedType },
    'Contract type detected successfully'
  );
};

export default detectTypeContoller;
