import { Response } from 'express';
import { User, IUser } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export class AuthService {
  static sendTokens(user: IUser, statusCode: number, res: Response, message: string) {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store hashed or direct refresh token on user model for rotation
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    const cookieOptions = {
      expires: new Date(Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: (config.env === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
    };

    res.cookie('token', accessToken, cookieOptions);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
      },
      accessToken,
      refreshToken,
    };
  }

  static async register(data: { name: string; email: string; password: string; phoneNumber?: string }) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists.');
    }

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      phoneNumber: data.phoneNumber,
      role: 'customer',
    });

    return user;
  }

  static async login(email: string, password: string): Promise<IUser> {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    return user;
  }
}
