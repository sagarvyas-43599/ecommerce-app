import mongoose, { Document, Schema } from 'mongoose';

export type DiscountType = 'percentage' | 'fixed';

export interface ICoupon extends Document {
  code: string;
  discountType: DiscountType;
  discountAmount: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  startDate: Date;
  expiryDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isValidForOrder(orderAmount: number): { valid: boolean; message?: string; discount: number };
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
      default: 'percentage',
    },
    discountAmount: {
      type: Number,
      required: true,
      min: [1, 'Discount amount must be greater than 0'],
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: true,
    },
    usageLimit: {
      type: Number,
      default: null, // Unlimited if null
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

CouponSchema.methods.isValidForOrder = function (orderAmount: number) {
  const now = new Date();
  if (!this.isActive) {
    return { valid: false, message: 'Coupon is currently inactive', discount: 0 };
  }
  if (now < this.startDate) {
    return { valid: false, message: 'Coupon is not yet active', discount: 0 };
  }
  if (now > this.expiryDate) {
    return { valid: false, message: 'Coupon has expired', discount: 0 };
  }
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached', discount: 0 };
  }
  if (orderAmount < this.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${this.minOrderValue} required to use this coupon`,
      discount: 0,
    };
  }

  let calculatedDiscount = 0;
  if (this.discountType === 'percentage') {
    calculatedDiscount = (orderAmount * this.discountAmount) / 100;
    if (this.maxDiscountAmount && calculatedDiscount > this.maxDiscountAmount) {
      calculatedDiscount = this.maxDiscountAmount;
    }
  } else {
    calculatedDiscount = Math.min(orderAmount, this.discountAmount);
  }

  return {
    valid: true,
    discount: Math.round(calculatedDiscount * 100) / 100,
  };
};

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
