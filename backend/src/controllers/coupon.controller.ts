import { Request, Response } from 'express';
import { Coupon } from '../models/coupon.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse, PaginationMeta } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
  if (existing) {
    throw ApiError.conflict('Coupon code already exists');
  }

  const coupon = await Coupon.create({
    ...req.body,
    code: req.body.code.toUpperCase(),
  });

  return ApiResponse.send(res, 201, coupon, 'Coupon created successfully');
});

export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return ApiResponse.send(res, 200, coupons, 'Coupons fetched successfully');
});

export const getCouponByCode = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  return ApiResponse.send(res, 200, coupon, 'Coupon retrieved successfully');
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  return ApiResponse.send(res, 200, coupon, 'Coupon updated successfully');
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  return ApiResponse.send(res, 200, null, 'Coupon deleted successfully');
});
