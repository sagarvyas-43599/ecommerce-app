import mongoose, { Document, Schema } from 'mongoose';

export type InventoryChangeType = 'restock' | 'order_deduct' | 'order_cancel_restock' | 'manual_adjustment' | 'return_restock';

export interface IInventoryLog extends Document {
  product: mongoose.Types.ObjectId;
  changeType: InventoryChangeType;
  quantityChange: number; // positive or negative
  previousStock: number;
  newStock: number;
  order?: mongoose.Types.ObjectId;
  performedBy?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    changeType: {
      type: String,
      enum: ['restock', 'order_deduct', 'order_cancel_restock', 'manual_adjustment', 'return_restock'],
      required: true,
      index: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      index: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const InventoryLog = mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema);
