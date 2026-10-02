import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId?: string;
  isMain?: boolean;
}

export interface IProductAttribute {
  name: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  category: mongoose.Types.ObjectId;
  brand: string;
  images: IProductImage[];
  stock: number;
  lowStockThreshold: number;
  sku: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  attributes: IProductAttribute[];
  seller?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    isMain: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductAttributeSchema = new Schema<IProductAttribute>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      index: true,
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true,
    },
    images: {
      type: [ProductImageSchema],
      validate: {
        validator: (v: IProductImage[]) => v && v.length > 0,
        message: 'Product must have at least one image',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
      index: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val: number) => Math.round(val * 10) / 10, // Round to 1 decimal
      index: true,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: [{ type: String, trim: true }],
    attributes: [ProductAttributeSchema],
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Full text search compound index on name, description, brand and tags
ProductSchema.index(
  {
    name: 'text',
    description: 'text',
    brand: 'text',
    tags: 'text',
  },
  {
    weights: {
      name: 10,
      brand: 5,
      tags: 3,
      description: 1,
    },
    name: 'ProductTextIndex',
  }
);

// Compound indexes for sorting and filtering
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ category: 1, ratingsAverage: -1 });
ProductSchema.index({ isActive: 1, createdAt: -1 });

// Slug generator
ProductSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
