import { Response } from 'express';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';
import { Payment } from '../models/payment.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse, PaginationMeta } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getAdminDashboardStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    completedOrders,
    revenueAggregation,
    recentOrders,
    lowStockCount,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'delivered' }),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Product.countDocuments({ $expr: { $lte: ['$stock', '$lowStockThreshold'] } }),
  ]);

  const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

  // Monthly revenue trend (last 6 months)
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        ordersCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return ApiResponse.send(
    res,
    200,
    {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        completedOrders,
        totalRevenue,
        lowStockCount,
      },
      monthlyRevenue,
      recentOrders,
    },
    'Admin dashboard statistics fetched successfully'
  );
});

export const getAllUsersAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const [users, totalItems] = await Promise.all([
    User.find()
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
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

  return ApiResponse.send(res, 200, users, 'Users fetched successfully', meta);
});

export const updateUserRoleAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['customer', 'admin', 'seller'].includes(role)) {
    throw ApiError.badRequest('Invalid role');
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) throw ApiError.notFound('User not found');

  return ApiResponse.send(res, 200, user, `User role changed to ${role}`);
});
