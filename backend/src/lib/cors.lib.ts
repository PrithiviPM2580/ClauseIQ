import type { CorsOptions } from 'cors';
import logger from '@/lib/logger.lib';
import config from '@/config/env.config';

const whitelistSet = new Set(config.CORS_WHITELIST);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || origin === null) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
    if (
      config.NODE_ENV === 'development' ||
      whitelistSet.has(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    logger.warn(`CORS policy blocked request from origin: ${origin}`);
    return callback(null, false);
  },
};

export default corsOptions;
