import { SuccessResponse } from '@//@types';
import logger from '@/lib/logger.lib';
import type { Response } from 'express';
import { Types } from 'mongoose';
import z from 'zod';

export const successResponse = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = 200
): Response => {
  logger.info('Success Response: ', { message, data });
  return res.status(statusCode).json(<SuccessResponse<T>>{
    ok: true,
    status: 'success',
    message,
    data,
  });
};

export const generateMongooseId = (): Types.ObjectId => {
  return new Types.ObjectId();
};

export const formatIssues = (issues: z.ZodError['issues']) => {
  return issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
};
