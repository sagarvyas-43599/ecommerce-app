import { rateLimit } from 'express-rate-limit';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many requests from this IP, please try again later.'));
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, // 20 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many authentication attempts. Please try again after 15 minutes.'));
  },
});

export const orderLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many order requests. Please slow down.'));
  },
});
