import mongoose, { Document, Schema } from 'mongoose';

export type PaymentMethod = 'stripe' | 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  gatewayTransactionId?: string;
  gatewayOrderId?: string;
  gatewaySignature?: string;
  gatewayResponseRaw?: any;
  refundId?: string;
  refundAmount?: number;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay', 'cod'],
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    gatewayTransactionId: {
      type: String,
      trim: true,
      index: true,
    },
    gatewayOrderId: {
      type: String,
      trim: true,
    },
    gatewaySignature: {
      type: String,
    },
    gatewayResponseRaw: {
      type: Schema.Types.Mixed,
    },
    refundId: {
      type: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
