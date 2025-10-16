import { Types } from 'mongoose';
import { dateNow } from '@/utils';
import redis from '@/config/redis.config';
import type { Request } from 'express';
import extractTextFromPDF from '@/ai/extractTextFromPDF.ai';
import detectContractType from '@/ai/detectContractType.ai';

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
