import { APIError } from '@/lib/apiError.lib';
import logger from '@/lib/logger.lib';
import { analyzeContractService } from '@/services/contract.service';
import { successResponse } from '@/utils';
import { AnalyzeContract } from '@/validation/contract.validation';
import type { Request, Response, NextFunction } from 'express';

const analizeContractController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;

  if (!user) {
    logger.error('User not found in request');
    return next(new APIError(401, 'User not authenticated'));
  }

  if (!req.file) {
    logger.error('No file uploaded');
    return next(new APIError(400, 'No file uploaded'));
  }

  const contract = await analyzeContractService(
    user,
    req,
    req.body as AnalyzeContract
  );

  if (!contract) {
    logger.error('Failed to analyze contract');
    return next(new APIError(500, 'Failed to analyze contract'));
  }

  successResponse(
    res,
    { contract },
    'Contract analyzed and saved successfully'
  );
};

export default analizeContractController;
