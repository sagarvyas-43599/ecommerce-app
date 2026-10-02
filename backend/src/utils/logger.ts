import winston from 'winston';
import { config } from '../config/env.js';

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    config.env === 'development' ? combine(colorize(), customFormat) : json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
