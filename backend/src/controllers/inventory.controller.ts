import { Response } from 'express';
import { InventoryService } from '../services/inventory.service.js';
import { InventoryLog } from '../models/inventoryLog.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse, PaginationMeta } from '../utils/ApiResponse.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getInventoryLogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.productId) filter.product = req.query.productId;
  if (req.query.changeType) filter.changeType = req.query.changeType;

  const [logs, totalItems] = await Promise.all([
    InventoryLog.find(filter)
      .populate('product', 'name sku price stock')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    InventoryLog.countDocuments(filter),
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

  return ApiResponse.send(res, 200, logs, 'Inventory logs fetched successfully', meta);
});

export const adjustProductStock = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity, notes } = req.body;

  const result = await InventoryService.adjustStock(
    productId,
    quantity,
    req.user!._id,
    notes
  );

  return ApiResponse.send(res, 200, result, 'Stock updated and logged successfully');
});

export const getLowStockProducts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const lowStockProducts = await Product.$where('this.stock <= this.lowStockThreshold')
    .select('name sku stock lowStockThreshold price')
    .lean();

  return ApiResponse.send(res, 200, lowStockProducts, 'Low stock alerts retrieved');
});
