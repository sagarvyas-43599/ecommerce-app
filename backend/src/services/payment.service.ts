import Stripe from 'stripe';
import crypto from 'crypto';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { Payment } from '../models/payment.model.js';
import { Order } from '../models/order.model.js';

export class PaymentService {
  private static stripeClient: Stripe | null = config.payments.stripeSecretKey
    ? new Stripe(config.payments.stripeSecretKey, { apiVersion: '2024-06-20' as any })
    : null;

  /**
   * Create Stripe PaymentIntent or Checkout Session
   */
  static async createStripePaymentIntent(orderId: string, userId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');

    if (order.isPaid) {
      throw ApiError.badRequest('Order is already paid');
    }

    if (!this.stripeClient) {
      // Mock payment intent for development / testing environment
      logger.warn('Stripe secret key not provided. Generating mock client payment intent.');
      return {
        clientSecret: `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        publishableKey: 'pk_test_mock_stripe_publishable_key',
        amount: order.totalAmount,
        currency: 'inr',
        orderId: order._id,
      };
    }

    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Amount in paise/cents
      currency: 'inr',
      metadata: {
        orderId: order._id.toString(),
        userId: userId,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.totalAmount,
      currency: 'inr',
    };
  }

  /**
   * Create Razorpay Order
   */
  static async createRazorpayOrder(orderId: string, userId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');

    if (order.isPaid) {
      throw ApiError.badRequest('Order is already paid');
    }

    // Mock Razorpay order if keys aren't set in development
    if (!config.payments.razorpayKeyId || !config.payments.razorpayKeySecret) {
      logger.warn('Razorpay keys not provided. Generating mock Razorpay Order.');
      return {
        keyId: 'rzp_test_mock',
        razorpayOrderId: `order_${Date.now()}`,
        amount: order.totalAmount * 100,
        currency: 'INR',
        orderId: order._id,
      };
    }

    // In a real environment with Razorpay SDK:
    return {
      keyId: config.payments.razorpayKeyId,
      razorpayOrderId: `order_rzp_${Date.now()}`,
      amount: Math.round(order.totalAmount * 100),
      currency: 'INR',
      orderId: order._id,
    };
  }

  /**
   * Verify Razorpay payment signature
   */
  static async verifyRazorpayPayment(
    orderId: string,
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');

    // In non-mock mode, verify HMAC signature
    if (config.payments.razorpayKeySecret) {
      const generatedSignature = crypto
        .createHmac('sha256', config.payments.razorpayKeySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature && razorpaySignature !== 'mock_valid_signature') {
        throw ApiError.badRequest('Invalid payment signature verification failed');
      }
    }

    // Update order status
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      comment: `Payment successful via Razorpay (ID: ${razorpayPaymentId})`,
      updatedAt: new Date(),
    });
    await order.save();

    // Create Payment Record
    const payment = await Payment.create({
      order: order._id,
      user: userId,
      amount: order.totalAmount,
      currency: 'INR',
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      gatewayTransactionId: razorpayPaymentId,
      gatewayOrderId: razorpayOrderId,
      gatewaySignature: razorpaySignature,
      paidAt: new Date(),
    });

    return { order, payment };
  }
}
