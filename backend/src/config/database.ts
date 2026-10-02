import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      autoIndex: config.env !== 'production', // Don't auto-build indexes in prod
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Retrying connection...');
    });
  } catch (error: any) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
