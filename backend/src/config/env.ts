import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://vyassagar43599_db_user:IHqrPsXPU7tdGPHA@cluster0.kim0rdb.mongodb.net/ecommerce_db',
  jwt: {
    secret: process.env.JWT_SECRET || 'ecommerce_super_secure_jwt_access_secret_key_2026_xyz123',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'ecommerce_super_secure_refresh_secret_key_2026_xyz123',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
    cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE || '7', 10),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '200', 10),
  },
  payments: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  adminSeed: {
    name: process.env.ADMIN_NAME || 'Admin Master',
    email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  },
};
