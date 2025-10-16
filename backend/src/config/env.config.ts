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
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
};

const config = validate(envSchema, envs);

export default config;
