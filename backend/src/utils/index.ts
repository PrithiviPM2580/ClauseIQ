import { SuccessResponse } from '@//@types';
import ai from '@/config/gemini.config';
import { APIError } from '@/lib/apiError.lib';
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

export const dateNow = () => {
  return Date.now();
};

const GEMINI_MODEL = 'gemini-2.5-flash';

export const generateAIResponse = async (
  prompt: string,
  model: string = GEMINI_MODEL
) => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    logger.error('Error generating AI response: ', error);
    throw new APIError(500, 'Error generating AI response');
  }
};

export const isValidMongoId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};
