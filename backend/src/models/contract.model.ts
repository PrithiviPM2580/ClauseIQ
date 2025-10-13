import mongoose, { Schema, Document } from 'mongoose';
import { UserDocument } from './user.model';
import { IRisk, IOpportunity, ICompensationStructure } from '@/@types';

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
  userFeedback: {
    rating: number;
    comments: string;
  };
  customFields: { [key: string]: string };
  expirationDate?: Date;
  language: string;
  aiMetadata: {
    model: string;
    confidenceScore?: number;
    tokensUsed?: number;
  };
  contractType: string;
  financialTerms?: {
    description: string;
    details: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const contractSchema = new Schema<IContract>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contractText: { type: String, required: true },

    risks: [
      {
        risk: String,
        explanation: String,
        severity: { type: String, enum: ['low', 'medium', 'high'] },
      },
    ],

    opportunities: [
      {
        opportunity: String,
        explanation: String,
        impact: { type: String, enum: ['low', 'medium', 'high'] },
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
      baseSalary: String,
      bonuses: String,
      equity: String,
      otherBenefits: String,
    },

    performanceMetrics: [{ type: String }],

    intellectualPropertyClauses: {
      type: Schema.Types.Mixed,
      validate: {
        validator: function (v: any) {
          return (
            typeof v === 'string' ||
            (Array.isArray(v) && v.every(item => typeof item === 'string'))
          );
        },
        message: (props: { value: any }) =>
          `${props.value} is not a valid string or array of strings!`,
      },
    },

    version: { type: Number, default: 1 },

    userFeedback: {
      rating: { type: Number, min: 1, max: 5, default: 0 },
      comments: { type: String, default: '' },
    },

    customFields: { type: Map, of: String },

    expirationDate: { type: Date },

    language: {
      type: String,
      enum: ['en', 'fr', 'es', 'de'],
      default: 'en',
    },

    aiMetadata: {
      model: { type: String, default: 'gemini-pro' },
      confidenceScore: { type: Number, min: 0, max: 1 },
      tokensUsed: Number,
    },

    contractType: {
      type: String,
      enum: ['employment', 'nda', 'sales', 'service', 'lease', 'other'],
      required: true,
    },

    financialTerms: {
      description: String,
      details: [String],
    },
  },
  { timestamps: true }
);

contractSchema.index({ userId: 1, contractType: 1 });

export default mongoose.model<IContract>('Contract', contractSchema);
