import { Response } from 'express';
import { Cart } from '../models/cart.model.js';
import { Order, IOrderItem } from '../models/order.model.js';
import { Coupon } from '../models/coupon.model.js';
import { Payment } from '../models/payment.model.js';
import { InventoryService } from '../services/inventory.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse, PaginationMeta } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const createOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { shippingAddress, paymentMethod, couponCode } = req.body;
  const userId = req.user!._id;

  // Retrieve user's cart
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Cannot create order. Your cart is empty.');
  }

  // Verify stock & compute items
  const orderItems: IOrderItem[] = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product: any = item.product;
    if (!product || !product.isActive) {
      throw ApiError.badRequest(`Item '${item.name}' is no longer available.`);
    }

    if (product.stock < item.quantity) {
      throw ApiError.badRequest(
        `Insufficient stock for '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}`
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: item.image,
      price: product.price,
      quantity: item.quantity,
      sku: product.sku,
    });

    subtotal += product.price * item.quantity;
  }

  // Handle Coupon Discount
  let discountAmount = 0;
  let appliedCouponData: { code: string; discount: number } | undefined;

  const targetCouponCode = couponCode || cart.couponCode;
  if (targetCouponCode) {
    const coupon = await Coupon.findOne({ code: targetCouponCode.toUpperCase(), isActive: true });
    if (coupon) {
      const validity = coupon.isValidForOrder(subtotal);
      if (validity.valid) {
        discountAmount = validity.discount;
        appliedCouponData = {
          code: coupon.code,
          discount: discountAmount,
        };
        // Increment usage count
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  // Tax calculation (e.g. 18% GST or flat shipping)
  const shippingFee = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
  const taxAmount = Math.round((subtotal - discountAmount) * 0.05 * 100) / 100; // 5% GST
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

  // 1. Create order
  const order = new Order({
    user: userId,
    items: orderItems,
    shippingAddress,
    itemsTotal: subtotal,
    taxAmount,
    shippingFee,
    discountAmount,
    couponApplied: appliedCouponData,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    orderStatus: 'placed',
    statusHistory: [
      {
        status: 'placed',
        comment: `Order placed via ${paymentMethod.toUpperCase()}`,
        updatedAt: new Date(),
      },
    ],
  });

  await order.save();

  // 2. Atomically reduce inventory
  await InventoryService.deductInventoryForOrder(
    orderItems.map((i) => ({ productId: i.product, quantity: i.quantity })),
    order._id,
    userId
  );

  // 3. If COD, create payment document record immediately
  if (paymentMethod === 'cod') {
    await Payment.create({
      order: order._id,
      user: userId,
      amount: totalAmount,
      currency: 'INR',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
    });
  }

  // 4. Empty the user's cart
  cart.items = [];
  cart.couponCode = undefined;
  cart.subtotal = 0;
  cart.discount = 0;
  cart.totalPrice = 0;
  await cart.save();

  return ApiResponse.send(res, 201, order, 'Order created successfully');
});

export const getMyOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);
  const skip = (page - 1) * limit;

  const [orders, totalItems] = await Promise.all([
    Order.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ user: req.user!._id }),
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

  return ApiResponse.send(res, 200, orders, 'User orders fetched successfully', meta);
});

export const getOrderById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phoneNumber')
    .lean();

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Check authorization: User can only view their own order unless admin
  if (req.user!.role !== 'admin' && order.user._id.toString() !== req.user!._id.toString()) {
    throw ApiError.forbidden('You are not authorized to view this order');
  }

  return ApiResponse.send(res, 200, order, 'Order retrieved successfully');
});

export const cancelOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found');

  // Customer or admin check
  if (req.user!.role !== 'admin' && order.user.toString() !== req.user!._id.toString()) {
    throw ApiError.forbidden('Unauthorized to cancel this order');
  }

  if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
    throw ApiError.badRequest(`Cannot cancel an order that is already ${order.orderStatus}`);
  }

  order.orderStatus = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by user';
  order.statusHistory.push({
    status: 'cancelled',
    comment: order.cancelReason,
    updatedAt: new Date(),
  });
  await order.save();

  // Restore inventory
  await InventoryService.restoreInventoryForCancelledOrder(
    order.items.map((i) => ({ product: i.product, quantity: i.quantity })),
    order._id,
    req.user!._id
  );

  return ApiResponse.send(res, 200, order, 'Order cancelled successfully and stock restored');
});

export const updateOrderStatusAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status, comment, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) throw ApiError.notFound('Order not found');

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
    if (order.paymentMethod === 'cod') {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentStatus = 'completed';
    }
  }

  order.statusHistory.push({
    status,
    comment: comment || `Status updated to ${status} by admin`,
    updatedAt: new Date(),
  });

  await order.save();
  return ApiResponse.send(res, 200, order, 'Order status updated successfully');
});

export const getAllOrdersAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.isPaid !== undefined) filter.isPaid = req.query.isPaid === 'true';

  const [orders, totalItems] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
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

  return ApiResponse.send(res, 200, orders, 'All orders retrieved successfully', meta);
});
