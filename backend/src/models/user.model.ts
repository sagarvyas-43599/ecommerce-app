import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export type UserRole = 'customer' | 'admin' | 'seller';

export interface IUserAddress {
  _id?: mongoose.Types.ObjectId;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  addresses: IUserAddress[];
  isEmailVerified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: 'India', trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Hidden by default in queries
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'seller'],
      default: 'customer',
      index: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    addresses: [AddressSchema],
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before save
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT access token
UserSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      email: this.email,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expire as any }
  );
};

// Instance method to generate JWT refresh token
UserSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire as any }
  );
};

export const User = mongoose.model<IUser>('User', UserSchema);
