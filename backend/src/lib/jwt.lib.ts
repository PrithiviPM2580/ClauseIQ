import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@/config/env.config';
import { APIError } from '@/lib/apiError.lib';
import { TokenPayload } from '@/@types';

const signToken = <T extends object>(
  payload: T,
  secret: string,
  expiresIn: string | number
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
};

const verifyToken = <T>(token: string, secret: string): T => {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    throw new APIError(401, 'Invalid or expired token');
  }
};

export const generateAccessToken = (payload: TokenPayload) =>
  signToken(
    payload,
    config.JWT_ACCESS_TOKEN_SECRET,
    config.JWT_ACCESS_TOKEN_EXPIRATION
  );

export const generateRefreshToken = (payload: TokenPayload) =>
  signToken(
    payload,
    config.JWT_REFRESH_TOKEN_SECRET,
    config.JWT_REFRESH_TOKEN_EXPIRATION
  );

export const verifyAccessToken = (token: string) =>
  verifyToken<TokenPayload>(token, config.JWT_ACCESS_TOKEN_SECRET);

export const verifyRefreshToken = (token: string) =>
  verifyToken<TokenPayload>(token, config.JWT_REFRESH_TOKEN_SECRET);
