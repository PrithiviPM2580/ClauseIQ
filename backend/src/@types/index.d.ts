import { ZodTypeAny } from 'zod';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export type Role = 'admin' | 'user' | 'guest';
export type TokenPayload = { userId: Types.ObjectId; role: Role };

export type SuccessResponse<T> = {
  ok: true;
  status: 'success';
  message: string;
  data: T;
};

export type MaybeAsyncRequestHandler = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => void | Promise<any>;

export type ValidateSchema = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};
