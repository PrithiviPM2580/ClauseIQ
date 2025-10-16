import ContractModel, { IContract } from '@/models/contract.model';
import { Types } from 'mongoose';

export const createContractAnalysis = async (
  userId: Types.ObjectId,
  contractText: string,
  contractType: string,
  analysis: Partial<IContract> = {}
): Promise<IContract> => {
  const savedAnalysis = await ContractModel.create({
    userId,
    contractText,
    contractType,
    ...analysis,
    language: 'en',
    aiModel: 'gemini-flash-pro',
  });
  return savedAnalysis;
};

export const getUserContractsLean = async (userId: Types.ObjectId) => {
  return await ContractModel.find({ userId }).sort({ createAt: -1 }).lean();
};
