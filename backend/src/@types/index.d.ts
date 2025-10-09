import { TokenPayload } from '@/lib/jwt.lib';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
