import logger from '@/lib/logger.lib';
import { getContractByIdService } from '@/services/contract.service';
import { isValidMongoId, successResponse } from '@/utils';
import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

const getContractByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    logger.error('User ID not found in request');
    return next(new Error('User not authenticated'));
  }

  if (!isValidMongoId(id)) {
    logger.error('Invalid contract ID');
    return next(new Error('Invalid contract ID'));
  }

  const contractId = new Types.ObjectId(id);
  const contract = await getContractByIdService(contractId, userId);
  successResponse(res, { contract }, 'Contract retrieved successfully');
};

export default getContractByIdController;
