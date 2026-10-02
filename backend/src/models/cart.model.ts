import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Snapshot of unit price when added or synchronized
  name: string;
  image: string;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  totalPrice: number;
  couponCode?: string;
  updatedAt: Date;
  createdAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
      index: true,
    },
    items: [CartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to recalculate cart totals
CartSchema.methods.calculateTotals = function (discountAmount = 0) {
  this.subtotal = this.items.reduce(
    (sum: number, item: ICartItem) => sum + item.price * item.quantity,
    0
  );
  this.discount = Math.min(this.subtotal, discountAmount);
  this.totalPrice = Math.max(0, this.subtotal - this.discount);
};

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
