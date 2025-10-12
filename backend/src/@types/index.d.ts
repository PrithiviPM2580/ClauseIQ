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
  next?: NextFunction
) => void | Promise<unknown>;

export type ValidateSchema = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};
