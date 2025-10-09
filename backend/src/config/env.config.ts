import { validate } from '@/lib/validateEnv.lib';
import { envSchema } from '@/validation/env.validation';
import dotenv from 'dotenv';

dotenv.config();

const envs = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOCAL_URL: process.env.LOCAL_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
  CORS_WHITELIST: process.env.CORS_WHITELIST,
  DB_NAME: process.env.DB_NAME,
  APP_NAME: process.env.APP_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
  WHITELIST_ADMIN: process.env.WHITELIST_ADMIN,
};

const config = validate(envSchema, envs);

export default config;
