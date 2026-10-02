import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import { InventoryLog } from '../models/inventoryLog.model.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export interface InventoryItemRequest {
  productId: string | mongoose.Types.ObjectId;
  quantity: number;
}

export class InventoryService {
  /**
   * Atomic inventory deduction with MongoDB session / optimistic locking
   */
  static async deductInventoryForOrder(
    items: InventoryItemRequest[],
    orderId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    session?: mongoose.ClientSession
  ): Promise<void> {
    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: item.quantity }, // Prevents race condition and negative inventory
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: false, session }
      );

      if (!product) {
        throw ApiError.badRequest(
          `Product unavailable or insufficient stock to fulfill your order.`
        );
      }

      // Log the inventory deduction
      await InventoryLog.create(
        [
          {
            product: product._id,
            changeType: 'order_deduct',
            quantityChange: -item.quantity,
            previousStock: product.stock,
            newStock: product.stock - item.quantity,
            order: orderId,
            performedBy: userId,
            notes: `Auto-deducted for Order #${orderId}`,
          },
        ],
        { session }
      );

      logger.info(
        `Inventory deducted for product ${product.name} (Qty: ${item.quantity}). New stock: ${
          product.stock - item.quantity
        }`
      );
    }
  }

  /**
   * Restock inventory if order is cancelled
   */
  static async restoreInventoryForCancelledOrder(
    items: { product: mongoose.Types.ObjectId; quantity: number }[],
    orderId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    session?: mongoose.ClientSession
  ): Promise<void> {
    for (const item of items) {
      const product = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true, session }
      );

      if (product) {
        await InventoryLog.create(
          [
            {
              product: product._id,
              changeType: 'order_cancel_restock',
              quantityChange: item.quantity,
              previousStock: product.stock - item.quantity,
              newStock: product.stock,
              order: orderId,
              performedBy: userId,
              notes: `Restocked due to Order #${orderId} cancellation`,
            },
          ],
          { session }
        );
      }
    }
  }

  /**
   * Manual admin stock adjustment
   */
  static async adjustStock(
    productId: string,
    newQuantity: number,
    adminId: mongoose.Types.ObjectId,
    notes?: string
  ) {
    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');

    const previousStock = product.stock;
    const diff = newQuantity - previousStock;

    product.stock = newQuantity;
    await product.save();

    const log = await InventoryLog.create({
      product: product._id,
      changeType: diff >= 0 ? 'restock' : 'manual_adjustment',
      quantityChange: diff,
      previousStock,
      newStock: newQuantity,
      performedBy: adminId,
      notes: notes || `Manual stock update by Admin`,
    });

    return { product, log };
  }
}
