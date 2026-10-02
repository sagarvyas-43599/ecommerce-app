import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/env.js';
import { globalLimiter } from './middlewares/rateLimit.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Route imports
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import reviewRoutes from './routes/review.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import adminRoutes from './routes/admin.routes.js';

export const createApp = (): express.Application => {
  const app = express();

  // 1. Security HTTP Headers
  app.use(helmet());

  // 2. Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Body parsers & cookie parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 4. Data sanitization against NoSQL injection
  app.use(mongoSanitize());

  // 5. Prevent HTTP parameter pollution
  app.use(hpp());

  // 6. Response compression (gzip)
  app.use(compression());

  // 7. Request logging
  if (config.env === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // 8. Global rate limiter
  app.use(globalLimiter);

  // Health Check
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // 9. API Module Routes
  const prefix = config.apiPrefix;
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/products`, productRoutes);
  app.use(`${prefix}/categories`, categoryRoutes);
  app.use(`${prefix}/cart`, cartRoutes);
  app.use(`${prefix}/wishlist`, wishlistRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/payments`, paymentRoutes);
  app.use(`${prefix}/coupons`, couponRoutes);
  app.use(`${prefix}/reviews`, reviewRoutes);
  app.use(`${prefix}/inventory`, inventoryRoutes);
  app.use(`${prefix}/admin`, adminRoutes);

  // 10. 404 and Error Handler
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
