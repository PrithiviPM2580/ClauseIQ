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
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1),
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
  DB_NAME: z.string().min(1),
  APP_NAME: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  WHITELIST_ADMIN: z
    .string()
    .default('')
    .transform(v =>
      v
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(email => email.length > 0)
    ),
});

export type Env = z.infer<typeof envSchema>;
