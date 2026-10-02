import mongoose, { Document, Schema } from 'mongoose';
import { IUserAddress } from './user.model.js';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  comment?: string;
  updatedAt: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IUserAddress;
  itemsTotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  couponApplied?: {
    code: string;
    discount: number;
  };
  totalAmount: number;
  paymentMethod: 'stripe' | 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: OrderStatus;
  statusHistory: IOrderStatusHistory[];
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  trackingNumber?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    sku: { type: String, required: true },
  },
  { _id: false }
);

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    status: {
      type: String,
      required: true,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    },
    comment: { type: String },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [OrderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    itemsTotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    couponApplied: {
      code: { type: String },
      discount: { type: Number, default: 0 },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
      index: true,
    },
    statusHistory: [OrderStatusHistorySchema],
    isPaid: { type: Boolean, default: false, index: true },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false, index: true },
    deliveredAt: { type: Date },
    trackingNumber: { type: String },
    cancelReason: { type: String },
  },
  {
    timestamps: true,
  }
);

// Auto-generate orderNumber before save if not provided
OrderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `ORD-${dateStr}-${randomSuffix}`;
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
