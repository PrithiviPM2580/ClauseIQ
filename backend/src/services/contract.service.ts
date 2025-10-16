import { Types } from 'mongoose';
import { dateNow } from '@/utils';
import redis from '@/config/redis.config';
import type { Request } from 'express';
import extractTextFromPDF from '@/ai/extractTextFromPDF.ai';
import detectContractType from '@/ai/detectContractType.ai';
import { AnalyzeContract } from '@/validation/contract.validation';
import logger from '@/lib/logger.lib';
import { APIError } from '@/lib/apiError.lib';
import { TokenPayload } from '@/@types';
import { analyzeContractWithAI } from '@/ai/analyzeContractWithAi.ai';
import {
  createContractAnalysis,
  getUserContractsLean,
} from '@/dao/contract.dao';

export const detectTypeService = async (
  req: Request,
  userId: Types.ObjectId
) => {
  const fileKey = `file:${userId.toString()}:${dateNow()}`;
  await redis.set(fileKey, req.file?.buffer);
  await redis.expire(fileKey, 3600);

  const pdfText = await extractTextFromPDF(fileKey);
  const detectedType = await detectContractType(pdfText);

  await redis.del(fileKey);

  return detectedType;
};

export const analyzeContractService = async (
  user: TokenPayload,
  req: Request,
  body: AnalyzeContract
) => {
  const { contractType } = body;

  if (!contractType) {
    logger.error('Contract type is required');
    throw new APIError(400, 'Contract type is required');
  }

  const fileKey = `file:${user.userId}:${Date.now()}`;
  await redis.set(fileKey, req.file?.buffer);
  await redis.expire(fileKey, 3600);

  const pdfText = await extractTextFromPDF(fileKey);
  let analysis;

  if (user.isPremium) {
    analysis = await analyzeContractWithAI(pdfText, 'premium', contractType);
  } else {
    analysis = await analyzeContractWithAI(pdfText, 'free', contractType);
  }

  if (!analysis.summary || !analysis.risks || !analysis.opportunities) {
    logger.error('AI analysis failed to generate complete results');
    throw new APIError(500, 'AI analysis failed to generate complete results');
  }

  const savedAnalysis = await createContractAnalysis(
    user.userId as Types.ObjectId,
    pdfText,
    contractType,
    analysis
  );

  return savedAnalysis;
};

export const getUserContractService = async (userId: Types.ObjectId) => {
  return await getUserContractsLean(userId);
};
