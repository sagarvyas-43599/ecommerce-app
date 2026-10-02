import { Response } from 'express';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { Coupon } from '../models/coupon.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const getCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  let cart = await Cart.findOne({ user: req.user!._id }).populate({
    path: 'items.product',
    select: 'name slug price images stock isActive',
  });

  if (!cart) {
    cart = await Cart.create({
      user: req.user!._id,
      items: [],
      subtotal: 0,
      discount: 0,
      totalPrice: 0,
    });
  }

  return ApiResponse.send(res, 200, cart, 'Cart retrieved successfully');
});

export const addToCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw ApiError.notFound('Product not found or inactive');
  }

  if (product.stock < quantity) {
    throw ApiError.badRequest(`Insufficient stock. Only ${product.stock} available.`);
  }

  let cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) {
    cart = new Cart({
      user: req.user!._id,
      items: [],
      subtotal: 0,
      discount: 0,
      totalPrice: 0,
    });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  const mainImage = product.images.find((img) => img.isMain)?.url || product.images[0]?.url || '';

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (product.stock < newQty) {
      throw ApiError.badRequest(`Cannot add more. Total in cart (${newQty}) exceeds stock (${product.stock}).`);
    }
    cart.items[existingItemIndex].quantity = newQty;
    cart.items[existingItemIndex].price = product.price; // sync price
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      price: product.price,
      name: product.name,
      image: mainImage,
    });
  }

  // Recalculate coupon discount if one exists
  let discountAmount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
    if (coupon) {
      const tempSubtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const validity = coupon.isValidForOrder(tempSubtotal);
      if (validity.valid) {
        discountAmount = validity.discount;
      } else {
        cart.couponCode = undefined;
      }
    } else {
      cart.couponCode = undefined;
    }
  }

  (cart as any).calculateTotals(discountAmount);
  await cart.save();

  return ApiResponse.send(res, 200, cart, 'Item added to cart');
});

export const updateCartItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex === -1) {
    throw ApiError.notFound('Item not in cart');
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');
    if (product.stock < quantity) {
      throw ApiError.badRequest(`Insufficient stock. Only ${product.stock} items available`);
    }
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;
  }

  // Recalculate discount
  let discountAmount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
    if (coupon) {
      const tempSubtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const validity = coupon.isValidForOrder(tempSubtotal);
      if (validity.valid) discountAmount = validity.discount;
      else cart.couponCode = undefined;
    }
  }

  (cart as any).calculateTotals(discountAmount);
  await cart.save();

  return ApiResponse.send(res, 200, cart, 'Cart updated successfully');
});

export const removeCartItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  let discountAmount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
    if (coupon) {
      const tempSubtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const validity = coupon.isValidForOrder(tempSubtotal);
      if (validity.valid) discountAmount = validity.discount;
      else cart.couponCode = undefined;
    }
  }

  (cart as any).calculateTotals(discountAmount);
  await cart.save();

  return ApiResponse.send(res, 200, cart, 'Item removed from cart');
});

export const applyCartCoupon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { code } = req.body;

  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Cart is empty. Add products before applying a coupon.');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    throw ApiError.notFound('Invalid coupon code');
  }

  const validity = coupon.isValidForOrder(cart.subtotal);
  if (!validity.valid) {
    throw ApiError.badRequest(validity.message || 'Coupon is not applicable');
  }

  cart.couponCode = coupon.code;
  (cart as any).calculateTotals(validity.discount);
  await cart.save();

  return ApiResponse.send(res, 200, cart, `Coupon '${coupon.code}' applied successfully. You saved ₹${validity.discount}`);
});

export const removeCartCoupon = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  cart.couponCode = undefined;
  (cart as any).calculateTotals(0);
  await cart.save();

  return ApiResponse.send(res, 200, cart, 'Coupon removed successfully');
});

export const clearCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user!._id },
    { items: [], subtotal: 0, discount: 0, totalPrice: 0, couponCode: undefined },
    { new: true }
  );

  return ApiResponse.send(res, 200, cart, 'Cart cleared successfully');
});
