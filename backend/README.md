# 🛍️ Production-Grade E-Commerce REST API Backend

Built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB (Mongoose)** using Clean Architecture and Enterprise Best Practices.

---

## 🚀 Key Features & Enterprise Best Practices

- **Strict TypeScript Architecture**: Full end-to-end type safety, typed models, DTOs, and Express request extensions.
- **Separate MongoDB Collections**: `users`, `products`, `categories`, `carts`, `wishlists`, `orders`, `payments`, `coupons`, `reviews`, and `inventorylogs`.
- **Database Optimization & Performance**:
  - Compound indexes (`{ category: 1, price: 1 }`, text search indexes).
  - Lean hydration (`.lean()`) for fast reads.
  - Selective field projections (`.select(...)`).
  - Native MongoDB aggregation pipelines for dashboard analytics and review averages.
  - High concurrency connection pool (`maxPoolSize: 20`).
- **Security & Hardening**:
  - `helmet` security headers.
  - `express-mongo-sanitize` to block NoSQL Injection attacks.
  - `hpp` to prevent HTTP Parameter Pollution.
  - Multi-tier `express-rate-limit` (Global, Auth brute-force protection, Order checkout protection).
  - Password hashing with `bcryptjs` (salt rounds: 10).
  - JWT Authentication with Token rotation & Refresh Tokens.
  - Role-Based Access Control (**RBAC**): `customer`, `admin`, `seller`.
- **Robust Validation**: Zod runtime schema validation on query, params, and body.
- **Centralized Error Handling**: Standardized `ApiError`, `ApiResponse`, and error middleware handling Mongoose cast errors, unique constraint violations, and JWT errors.

---

## 📂 Project Architecture

```
backend/
├── src/
│   ├── config/             # DB & Environment configs
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/        # Request handlers
│   │   ├── admin.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── category.controller.ts
│   │   ├── coupon.controller.ts
│   │   ├── inventory.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── product.controller.ts
│   │   ├── review.controller.ts
│   │   ├── user.controller.ts
│   │   └── wishlist.controller.ts
│   ├── middlewares/        # Auth, RBAC, Rate-limiting, Zod & Error handlers
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validate.middleware.ts
│   ├── models/             # Mongoose schemas, hooks & compound indexes
│   │   ├── cart.model.ts
│   │   ├── category.model.ts
│   │   ├── coupon.model.ts
│   │   ├── inventoryLog.model.ts
│   │   ├── order.model.ts
│   │   ├── payment.model.ts
│   │   ├── product.model.ts
│   │   ├── review.model.ts
│   │   ├── user.model.ts
│   │   └── wishlist.model.ts
│   ├── routes/             # Express API routes
│   │   ├── admin.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── category.routes.ts
│   │   ├── coupon.routes.ts
│   │   ├── inventory.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── product.routes.ts
│   │   ├── review.routes.ts
│   │   ├── user.routes.ts
│   │   └── wishlist.routes.ts
│   ├── seeders/            # Database seeder
│   │   └── seed.ts
│   ├── services/           # Business logic, inventory locking, payment gateways
│   │   ├── auth.service.ts
│   │   ├── inventory.service.ts
│   │   └── payment.service.ts
│   ├── utils/              # Structured logger (Winston), ApiError, ApiResponse
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   ├── asyncHandler.ts
│   │   └── logger.ts
│   ├── app.ts              # Express App setup & middleware pipeline
│   └── server.ts           # Server initialization & graceful shutdown
├── .env.example
├── package.json
└── tsconfig.json
```

---

## ⚙️ Installation & Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and adjust the MongoDB connection URI:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Seed Database with Initial Data**:
   Populate users, categories, products (iPhone 15, Case, Sony ANC), and coupons:
   ```bash
   npm run seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📑 API Endpoints Overview

### 🔐 1. Authentication & Users (`/api/v1/users`)
- `POST /register` - Register a new customer
- `POST /login` - Login and obtain access/refresh tokens
- `POST /refresh-token` - Refresh expired access token
- `POST /logout` - Logout & clear cookie
- `GET /me` - Get profile details (Auth required)
- `PUT /me` - Update profile (Auth required)
- `PUT /change-password` - Change password
- `POST /address` - Add new shipping address
- `DELETE /address/:addressId` - Delete address

### 📦 2. Products (`/api/v1/products`)
- `GET /` - Paginated products with full-text search, category, brand, price filters & sorting
- `GET /:identifier` - Get product by Slug or ObjectId
- `POST /` - Create product (Admin / Seller)
- `PUT /:id` - Update product (Admin / Seller)
- `DELETE /:id` - Delete product (Admin)

### 🏷️ 3. Categories (`/api/v1/categories`)
- `GET /` - List all active categories
- `GET /:slug` - Category details
- `POST /` - Create category (Admin)
- `PUT /:id` - Update category (Admin)
- `DELETE /:id` - Delete category (Admin)

### 🛒 4. Cart (`/api/v1/cart`)
- `GET /` - View current user cart with live price calculations
- `POST /items` - Add product with quantity to cart
- `PUT /items/:productId` - Update item quantity
- `DELETE /items/:productId` - Remove item from cart
- `POST /coupon` - Apply coupon code
- `DELETE /coupon` - Remove coupon code
- `DELETE /clear` - Empty cart

### 💖 5. Wishlist (`/api/v1/wishlist`)
- `GET /` - Retrieve user's wishlist
- `POST /toggle/:productId` - Add or remove product from wishlist

### 🛍️ 6. Orders & Checkout (`/api/v1/orders`)
- `POST /` - Place order from cart, automatically locks & reduces stock
- `GET /my-orders` - User order history
- `GET /:id` - Order details
- `POST /:id/cancel` - Cancel order & restore inventory stock
- `GET /admin/all` - View all orders (Admin)
- `PUT /admin/:id/status` - Update order tracking status (Admin)

### 💳 7. Payments (`/api/v1/payments`)
- `POST /stripe/create-intent` - Create Stripe PaymentIntent
- `POST /razorpay/create-order` - Create Razorpay Order
- `POST /razorpay/verify` - Verify signature and update order to paid
- `GET /admin/all` - List all payment audit logs (Admin)

### 🎟️ 8. Coupons (`/api/v1/coupons`)
- `GET /code/:code` - Verify coupon code
- `GET /` - List all coupons (Admin)
- `POST /` - Create coupon (Admin)
- `PUT /:id` - Update coupon (Admin)
- `DELETE /:id` - Delete coupon (Admin)

### ⭐ 9. Reviews (`/api/v1/reviews`)
- `GET /product/:productId` - Get paginated reviews
- `POST /product/:productId` - Post review (Auto recalculates product average rating)
- `DELETE /:id` - Remove review

### 📊 10. Inventory & Admin (`/api/v1/inventory`, `/api/v1/admin`)
- `GET /api/v1/inventory/logs` - Stock audit trail
- `GET /api/v1/inventory/low-stock` - Low stock alerts
- `POST /api/v1/inventory/adjust` - Manual stock adjustment
- `GET /api/v1/admin/dashboard-stats` - Metrics, total revenue, monthly trends
- `GET /api/v1/admin/users` - Paginated user directory
- `PATCH /api/v1/admin/users/:id/role` - Change user permissions
