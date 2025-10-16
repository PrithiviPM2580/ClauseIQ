import { z } from 'zod';

export const analyzeContractValidationSchema = z.object({
  contractType: z
    .string()
    .min(3, 'Contract type must be at least 3 characters')
    .max(100, 'Contract type must be less than 100 characters'),
});

export const getContractByIdValidationSchema = z.object({
  id: z.string().min(24, 'Invalid contract ID').max(24, 'Invalid contract ID'),
});

export type AnalyzeContract = z.infer<typeof analyzeContractValidationSchema>;
export type GetContractById = z.infer<typeof getContractByIdValidationSchema>;
