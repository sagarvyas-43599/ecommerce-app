import { Request, Response } from 'express';
import { Review } from '../models/review.model.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse, PaginationMeta } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const createProductReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;
  const userId = req.user!._id;

  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ product: productId, user: userId });
  if (existingReview) {
    throw ApiError.conflict('You have already reviewed this product');
  }

  // Check if verified purchase (optional verification check)
  const orderWithProduct = await Order.findOne({
    user: userId,
    'items.product': productId,
    orderStatus: 'delivered',
  });

  const review = await Review.create({
    product: productId,
    user: userId,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    isVerifiedPurchase: !!orderWithProduct,
  });

  return ApiResponse.send(res, 201, review, 'Review added successfully');
});

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);
  const skip = (page - 1) * limit;

  const [reviews, totalItems] = await Promise.all([
    Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ product: productId }),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;
  const meta: PaginationMeta = {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return ApiResponse.send(res, 200, reviews, 'Product reviews fetched successfully', meta);
});

export const deleteReview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const review = await Review.findById(id);

  if (!review) throw ApiError.notFound('Review not found');

  if (req.user!.role !== 'admin' && review.user.toString() !== req.user!._id.toString()) {
    throw ApiError.forbidden('You cannot delete this review');
  }

  await Review.findByIdAndDelete(id);
  return ApiResponse.send(res, 200, null, 'Review deleted successfully');
});
