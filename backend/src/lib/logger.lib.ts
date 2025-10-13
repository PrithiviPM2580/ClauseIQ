import winston from 'winston';
import config from '@/config/env.config';
import util from 'util';

const { combine, timestamp, printf, colorize } = winston.format;

const transports: winston.transport[] = [];

const colors = {
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  white: (text: string) => `\x1b[37m${text}\x1b[0m`,
};

const customFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ timestamp, level, message, service, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${colors.green(util.inspect(meta, { depth: null, colors: true }))}`
      : '';
    return `${colors.blue(`${timestamp}`)} [${level}] ${colors.magenta(`[APP: ${service ?? 'app'}]`)}: ${message} ${metaStr}`;
  })
);

if (config.NODE_ENV !== 'production' && config.NODE_ENV !== 'test') {
  transports.push(
    new winston.transports.Console({
      level: config.LOG_LEVEL,
      format: customFormat,
    })
  );
} else {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  );
  transports.push(
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: customFormat,
  transports,
  silent: config.NODE_ENV === 'test',
});

export default logger;
