import { Response } from 'express';
import { Wishlist } from '../models/wishlist.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getWishlist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  let wishlist = await Wishlist.findOne({ user: req.user!._id }).populate({
    path: 'products',
    select: 'name slug price compareAtPrice images stock ratingsAverage ratingsQuantity isActive',
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user!._id, products: [] });
  }

  return ApiResponse.send(res, 200, wishlist, 'Wishlist fetched successfully');
});

export const toggleWishlistItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user!._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user!._id, products: [] });
  }

  const index = wishlist.products.findIndex((id) => id.toString() === productId);
  let action = '';

  if (index > -1) {
    wishlist.products.splice(index, 1);
    action = 'removed from';
  } else {
    wishlist.products.push(product._id);
    action = 'added to';
  }

  await wishlist.save();
  return ApiResponse.send(res, 200, wishlist, `Product ${action} wishlist`);
});
