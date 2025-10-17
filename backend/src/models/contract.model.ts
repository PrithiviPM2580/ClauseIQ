import mongoose, { Schema, Document } from 'mongoose';
import { UserDocument } from './user.model';
import {
  IRisk,
  IOpportunity,
  ICompensationStructure,
  IUserFeedback,
  IFinancialTerms,
} from '@/@types';

export interface IContract extends Document {
  userId: UserDocument['_id'];
  contractText: string;
  risks: IRisk[];
  opportunities: IOpportunity[];
  summary: string;
  recommendations: string[];
  keyClauses: string[];
  legalCompliance: string;
  negotiationPoints: string[];
  contractDuration: string;
  terminationConditions: string;
  overallScore: number;
  compensationStructure: ICompensationStructure;
  performanceMetrics: string[];
  intellectualPropertyClauses: string | string[];
  version: number;
  userFeedback: IUserFeedback;
  customFields: Record<string, string>;
  expirationDate?: Date;
  language: string;
  aiMetadata: string;
  contractType: string;
  financialTerms?: IFinancialTerms;
  createdAt: Date;
  updatedAt: Date;
}

const contractSchema = new Schema<IContract>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contractText: { type: String, required: true },

    risks: [
      {
        risk: { type: String },
        explanation: { type: String },
        severity: {
          type: String,
          enum: ['low', 'medium', 'high'],
          required: true,
        },
      },
    ],

    opportunities: [
      {
        opportunity: { type: String },
        explanation: { type: String },
        impact: {
          type: String,
          enum: ['low', 'medium', 'high'],
          required: true,
        },
      },
    ],

    summary: { type: String, required: true },
    recommendations: [{ type: String }],
    keyClauses: [{ type: String }],
    legalCompliance: { type: String },
    negotiationPoints: [{ type: String }],
    contractDuration: { type: String },
    terminationConditions: { type: String },
    overallScore: { type: Number, min: 0, max: 100 },

    compensationStructure: {
      baseSalary: { type: String },
      bonuses: { type: String },
      equity: { type: String },
      otherBenefits: { type: String },
    },

    performanceMetrics: [{ type: String }],

    intellectualPropertyClauses: {
      type: Schema.Types.Mixed,
      validate: {
        validator: (v: unknown): boolean =>
          typeof v === 'string' ||
          (Array.isArray(v) && v.every(item => typeof item === 'string')),
        message: (props: { value: unknown }) =>
          `${props.value} is not a valid string or array of strings!`,
      },
    },

    version: { type: Number, default: 1 },

    userFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comments: { type: String },
    },

    customFields: { type: Map, of: String },

    expirationDate: { type: Date },

    language: {
      type: String,
      enum: ['en', 'fr', 'es', 'de'],
      default: 'en',
    },

    aiMetadata: { type: String, default: 'gemini-pro' },

    contractType: {
      type: String,
      enum: ['employment', 'nda', 'sales', 'service', 'lease', 'other'],
      required: true,
    },

    financialTerms: {
      description: { type: String },
      details: [{ type: String }],
    },
  },
  { timestamps: true }
);

// 📈 Index for faster queries by user and contract type
contractSchema.index({ userId: 1, contractType: 1 });

const ContractModel = mongoose.model<IContract>('Contract', contractSchema);

export default ContractModel;
