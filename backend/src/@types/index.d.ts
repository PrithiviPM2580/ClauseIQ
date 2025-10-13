import { ZodTypeAny } from 'zod';
import { Types } from 'mongoose';
import { UserDocument } from '@/models/user.model';
import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export type Role = 'admin' | 'user' | 'guest';
export type TokenPayload = { userId?: Types.ObjectId; role?: Role };

export type CreateUser = Pick<
  UserDocument,
  'email' | 'password' | 'username' | '_id'
>;

export type SuccessResponse<T> = {
  ok: true;
  status: 'success';
  message: string;
  data: T;
};

export type MaybeAsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<unknown>;

export type ValidateSchema = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

interface IRisk {
  risk: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

interface IOpportunity {
  opportunity: string;
  explanation: string;
  impact: 'low' | 'medium' | 'high';
}

interface ICompensationStructure {
  baseSalary: string;
  bonuses: string;
  equity: string;
  otherBenefits: string;
}
