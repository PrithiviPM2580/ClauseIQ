import { validate } from '@/lib/validateEnv.lib';
import { envSchema } from '@/validation/env.validation';
import dotenv from 'dotenv';

dotenv.config();

const envs = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOCAL_URL: process.env.LOCAL_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
};

const config = validate(envSchema, envs);

export default config;
