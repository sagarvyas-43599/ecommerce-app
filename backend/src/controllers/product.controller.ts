import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse, PaginationMeta } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = { isActive: true };

  // Flexible regex and text search across Name, Brand, Tags & Categories
  if (req.query.search) {
    const searchStr = (req.query.search as string).trim();
    const regex = new RegExp(searchStr, 'i');

    // Also check if search query matches a Category name or slug
    const matchingCategories = await Category.find({
      $or: [{ name: regex }, { slug: regex }],
    }).select('_id');
    const matchedCategoryIds = matchingCategories.map((c) => c._id);

    filter.$or = [
      { name: regex },
      { brand: regex },
      { tags: regex },
      { description: regex },
      ...(matchedCategoryIds.length > 0 ? [{ category: { $in: matchedCategoryIds } }] : []),
    ];
  }

  // Explicit Category filter (support category ObjectId or slug)
  if (req.query.category) {
    const categoryParam = req.query.category as string;
    if (mongoose.Types.ObjectId.isValid(categoryParam)) {
      filter.category = new mongoose.Types.ObjectId(categoryParam);
    } else {
      const catDoc = await Category.findOne({ slug: categoryParam });
      if (catDoc) {
        filter.category = catDoc._id;
      }
    }
  }

  // Brand filter
  if (req.query.brand) {
    filter.brand = new RegExp(req.query.brand as string, 'i');
  }

  // Price range filter
  if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
    filter.price = {};
    if (req.query.minPrice !== undefined) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice !== undefined) filter.price.$lte = Number(req.query.maxPrice);
  }

  // Rating filter
  if (req.query.rating !== undefined) {
    filter.ratingsAverage = { $gte: Number(req.query.rating) };
  }

  // In-stock filter
  if (req.query.inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  // Featured filter
  if (req.query.isFeatured === 'true') {
    filter.isFeatured = true;
  }

  // Sorting
  let sortCriteria: any = { createdAt: -1 };
  if (req.query.sort) {
    const sortField = req.query.sort as string;
    if (sortField === 'price_asc') sortCriteria = { price: 1 };
    else if (sortField === 'price_desc') sortCriteria = { price: -1 };
    else if (sortField === 'rating') sortCriteria = { ratingsAverage: -1 };
    else if (sortField === 'newest') sortCriteria = { createdAt: -1 };
  }

  // High performance query with projection, indexes and lean
  const [products, totalItems] = await Promise.all([
    Product.find(filter)
      .select('name slug price compareAtPrice brand images stock ratingsAverage ratingsQuantity isFeatured category createdAt')
      .populate('category', 'name slug')
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
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

  return ApiResponse.send(res, 200, products, 'Products fetched successfully', meta);
});

export const getProductBySlugOrId = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

  const query = isObjectId ? { _id: identifier } : { slug: identifier };
  const product = await Product.findOne(query)
    .populate('category', 'name slug')
    .populate('seller', 'name email')
    .lean();

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  return ApiResponse.send(res, 200, product, 'Product details retrieved successfully');
});

export const createProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const productData = {
    ...req.body,
    seller: req.user?._id,
  };

  const product = await Product.create(productData);
  return ApiResponse.send(res, 201, product, 'Product created successfully');
});

export const updateProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  return ApiResponse.send(res, 200, product, 'Product updated successfully');
});

export const deleteProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  return ApiResponse.send(res, 200, null, 'Product deleted successfully');
});
