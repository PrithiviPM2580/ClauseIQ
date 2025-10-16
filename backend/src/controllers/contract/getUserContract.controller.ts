import { getUserContractService } from '@/services/contract.service';
import { successResponse } from '@/utils';
import type { Request, Response, NextFunction } from 'express';

const getUserContractController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    return next(new Error('User not authenticated'));
  }

  const contracts = await getUserContractService(userId);

  successResponse(res, { contracts }, 'User contracts retrieved successfully');
};

export default getUserContractController;
