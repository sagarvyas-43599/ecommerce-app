import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { User, IUser, UserRole } from '../models/user.model.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication required. Please log in.');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { id: string; role: string };

    const user = await User.findById(decoded.id).select('+role');
    if (!user) {
      throw ApiError.unauthorized('The user belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`Your role (${req.user?.role || 'Guest'}) does not have permission to perform this action.`)
      );
    }
    next();
  };
};
