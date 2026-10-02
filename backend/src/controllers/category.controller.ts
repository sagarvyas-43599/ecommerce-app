import { Request, Response } from 'express';
import { Category } from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Category.findOne({ name: req.body.name.trim() });
  if (existing) {
    throw ApiError.conflict('Category with this name already exists');
  }

  const category = await Category.create(req.body);
  return ApiResponse.send(res, 201, category, 'Category created successfully');
});

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true })
    .populate('parentCategory', 'name slug')
    .sort({ name: 1 })
    .lean();

  return ApiResponse.send(res, 200, categories, 'Categories fetched successfully');
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    .populate('parentCategory', 'name slug')
    .lean();

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  return ApiResponse.send(res, 200, category, 'Category retrieved successfully');
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  return ApiResponse.send(res, 200, category, 'Category updated successfully');
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  return ApiResponse.send(res, 200, null, 'Category deleted successfully');
});
