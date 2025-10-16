import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile =
  NODE_ENV === 'production'
    ? '.env.production'
    : NODE_ENV === 'test'
      ? '.env.test'
      : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const envSchema = z.object({
  PORT: z.coerce.number().min(1).default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  LOCAL_URL: z.url().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1, 'Access Token Secret is required'),
  JWT_REFRESH_TOKEN_SECRET: z
    .string()
    .min(1, 'Refresh Token Secret is required'),
  JWT_ACCESS_TOKEN_EXPIRATION: z
    .string()
    .regex(/^\d+(s|m|h|d)$/, 'Must be in format like 15m, 1h, 7d')
    .default('15m'),
  JWT_REFRESH_TOKEN_EXPIRATION: z
    .string()
    .regex(/^\d+(s|m|h|d)$/, 'Must be in format like 15m, 1h, 7d')
    .default('7d'),
  CORS_WHITELIST: z
    .string()
    .default('http://localhost:5173')
    .transform(v =>
      v.split(',').map(origin => origin.trim().replace(/\/$/, '').toLowerCase())
    ),
  DB_NAME: z.string().min(1, 'Database name is required'),
  APP_NAME: z.string().min(1, 'App name is required'),
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  WHITELIST_ADMIN: z
    .string()
    .default('')
    .transform(v =>
      v
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(email => email.length > 0)
    ),
  GOOGLE_CLIENT_ID: z.string().min(1, 'Client ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Client Secret is required'),
  GOOGLE_REDIRECT_URI: z.url('Must be a valid URL'),
  UPSTASH_REDIS_REST_URL: z.string().min(1, 'Upstash Redis URL is required'),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, 'Upstash Redis Token is required'),
  GOOGLE_API_KEY: z.string().min(1, 'Google API Key is required'),
});

export type Env = z.infer<typeof envSchema>;
