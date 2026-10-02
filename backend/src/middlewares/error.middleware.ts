import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors, false, err.stack);
  }

  // Handle Mongoose CastError (Bad ObjectId)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = ApiError.notFound(message);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for '${field}'. Please use another value.`;
    error = ApiError.conflict(message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authorization token');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authorization token has expired');
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(config.env === 'development' && { stack: error.stack }),
  };

  if (error.statusCode >= 500) {
    logger.error(`[500] ${req.method} ${req.originalUrl} - ${error.message}\nStack: ${error.stack}`);
  } else {
    logger.warn(`[${error.statusCode}] ${req.method} ${req.originalUrl} - ${error.message}`);
  }

  res.status(error.statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = ApiError.notFound(`Route not found - ${req.originalUrl}`);
  next(error);
};
