import mongoose, { Document, Schema } from 'mongoose';
import { Product } from './product.model.js';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from reviewing the same product more than once
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average product rating using MongoDB Aggregation
ReviewSchema.statics.calculateAverageRating = async function (productId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].ratingsQuantity,
      ratingsAverage: Math.round(stats[0].ratingsAverage * 10) / 10,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// Call calculateAverageRating after save
ReviewSchema.post('save', async function () {
  await (this.constructor as any).calculateAverageRating(this.product);
});

// Call calculateAverageRating after delete
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await (doc.constructor as any).calculateAverageRating(doc.product);
  }
});

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
