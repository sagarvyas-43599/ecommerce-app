import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.register(req.body);
  const authData = AuthService.sendTokens(user, 201, res, 'User registered successfully');
  return ApiResponse.send(res, 201, authData, 'Account created successfully');
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await AuthService.login(email, password);
  const authData = AuthService.sendTokens(user, 200, res, 'Logged in successfully');
  return ApiResponse.send(res, 200, authData, 'Login successful');
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { id: string };
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const authData = AuthService.sendTokens(user, 200, res, 'Token refreshed');
    return ApiResponse.send(res, 200, authData, 'Token refreshed successfully');
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
});

export const logoutUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'strict' : 'lax',
  });

  return ApiResponse.send(res, 200, null, 'Logged out successfully');
});

export const getCurrentUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findById(req.user!._id);
  return ApiResponse.send(res, 200, user, 'Profile fetched successfully');
});

export const updateUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const allowedFields = ['name', 'phoneNumber', 'avatar'];
  const updateData: any = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.user!._id, updateData, {
    new: true,
    runValidators: true,
  });

  return ApiResponse.send(res, 200, user, 'Profile updated successfully');
});

export const changeUserPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user!._id).select('+password');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  return ApiResponse.send(res, 200, null, 'Password updated successfully');
});

export const addUserAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) throw ApiError.notFound('User not found');

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  } else if (user.addresses.length === 0) {
    req.body.isDefault = true;
  }

  user.addresses.push(req.body);
  await user.save();

  return ApiResponse.send(res, 201, user.addresses, 'Address added successfully');
});

export const deleteUserAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user!._id);
  if (!user) throw ApiError.notFound('User not found');

  user.addresses = user.addresses.filter((addr) => addr._id?.toString() !== addressId);
  await user.save();

  return ApiResponse.send(res, 200, user.addresses, 'Address removed successfully');
});
