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
});

export type Env = z.infer<typeof envSchema>;
