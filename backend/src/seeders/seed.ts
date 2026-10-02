import dns from 'node:dns';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { Coupon } from '../models/coupon.model.js';
import { logger } from '../utils/logger.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to database for seeding...');

    // 1. Clear existing test data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    logger.info('Existing collections cleared.');

    // 2. Seed Admin and Customers
    const admin = await User.create({
      name: config.adminSeed.name,
      email: config.adminSeed.email,
      password: config.adminSeed.password,
      role: 'admin',
      phoneNumber: '+91 9876543210',
    });

    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password@123',
      role: 'customer',
      phoneNumber: '+91 9123456789',
      addresses: [
        {
          street: '42 MG Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true,
        },
      ],
    });
    logger.info('Users seeded (Admin & Customer).');

    // 3. Seed Categories
    const electronics = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Smartphones, Laptops, Audio, and Gadgets',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    });

    const accessories = await Category.create({
      name: 'Accessories',
      slug: 'accessories',
      description: 'Cases, Chargers, Cables, and Mounts',
      parentCategory: electronics._id,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    });

    const fashion = await Category.create({
      name: 'Fashion',
      slug: 'fashion',
      description: 'Men and Women Apparels',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
    });
    logger.info('Categories seeded.');

    // 4. Seed Products
    const products = await Product.create([
      {
        name: 'iPhone 15 Pro Max 256GB Titanium',
        slug: 'iphone-15-pro-max-256gb',
        description:
          'Apple iPhone 15 Pro Max with 6.7-inch Super Retina XDR display, Titanium design, A17 Pro Chip, 48MP main camera, and USB-C.',
        shortDescription: '6.7-inch display, A17 Pro chip, Titanium design',
        price: 70000,
        compareAtPrice: 79900,
        category: electronics._id,
        brand: 'Apple',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
            isMain: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
            isMain: false,
          },
        ],
        stock: 50,
        lowStockThreshold: 5,
        sku: 'APL-IPH15PM-256',
        ratingsAverage: 4.8,
        ratingsQuantity: 124,
        isFeatured: true,
        tags: ['apple', 'smartphone', 'iphone', 'flagship'],
        attributes: [
          { name: 'Color', value: 'Natural Titanium' },
          { name: 'Storage', value: '256GB' },
        ],
        seller: admin._id,
      },
      {
        name: 'iPhone 15 Pro MagSafe Silicone Case',
        slug: 'iphone-15-pro-magsafe-case',
        description: 'Designed by Apple to compliment iPhone 15 Pro, the Silicone Case with MagSafe is a delightful way to protect your iPhone.',
        shortDescription: 'Silicone case with built-in magnets for MagSafe',
        price: 1000,
        compareAtPrice: 1500,
        category: accessories._id,
        brand: 'Apple',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
            isMain: true,
          },
        ],
        stock: 200,
        lowStockThreshold: 20,
        sku: 'APL-CASE-15P-BLK',
        ratingsAverage: 4.5,
        ratingsQuantity: 89,
        isFeatured: false,
        tags: ['case', 'iphone', 'accessories', 'magsafe'],
        attributes: [
          { name: 'Color', value: 'Midnight Black' },
          { name: 'Material', value: 'Silicone' },
        ],
        seller: admin._id,
      },
      {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        slug: 'sony-wh1000xm5-headphones',
        description: 'Industry leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life.',
        shortDescription: 'Premium ANC Bluetooth Over-Ear Headphones',
        price: 26990,
        compareAtPrice: 29990,
        category: electronics._id,
        brand: 'Sony',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            isMain: true,
          },
        ],
        stock: 35,
        lowStockThreshold: 5,
        sku: 'SNY-WH1000XM5-BLK',
        ratingsAverage: 4.9,
        ratingsQuantity: 210,
        isFeatured: true,
        tags: ['sony', 'audio', 'headphones', 'noise-cancelling'],
        attributes: [
          { name: 'Color', value: 'Black' },
          { name: 'Battery Life', value: '30 Hours' },
        ],
        seller: admin._id,
      },
      {
        name: 'Classic Slim Fit Oxford Cotton Shirt',
        slug: 'classic-oxford-cotton-shirt',
        description: 'Crafted from 100% premium breathable cotton. Perfect for formal and smart-casual occasions.',
        shortDescription: '100% Cotton Button-down Formal Shirt',
        price: 1999,
        compareAtPrice: 2999,
        category: fashion._id,
        brand: 'UrbanCraft',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
            isMain: true,
          },
        ],
        stock: 80,
        lowStockThreshold: 10,
        sku: 'UC-SHIRT-OXF-L',
        ratingsAverage: 4.3,
        ratingsQuantity: 45,
        isFeatured: false,
        tags: ['shirt', 'cotton', 'fashion', 'men'],
        attributes: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Sky Blue' },
        ],
        seller: admin._id,
      },
    ]);
    logger.info(`Seeded ${products.length} products.`);

    // 5. Seed Coupons
    await Coupon.create([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountAmount: 10,
        minOrderValue: 500,
        maxDiscountAmount: 1000,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        usageLimit: 1000,
        isActive: true,
      },
      {
        code: 'SAVE500',
        discountType: 'fixed',
        discountAmount: 500,
        minOrderValue: 5000,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        isActive: true,
      },
    ]);
    logger.info('Coupons seeded (WELCOME10, SAVE500).');

    logger.info('🎉 Database seeding completed successfully!');
    logger.info('Default Admin: admin@ecommerce.com / Admin@123456');
    logger.info('Default Customer: john@example.com / Password@123');

    process.exit(0);
  } catch (err: any) {
    logger.error(`Seeding error: ${err.message}`);
    process.exit(1);
  }
};

seedDatabase();
