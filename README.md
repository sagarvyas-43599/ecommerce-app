# NEXUS STORE - Full-Stack E-Commerce Platform

A production-ready full-stack E-Commerce application built with **React, TypeScript, Node.js, Express, MongoDB, and Mongoose** following Clean Architecture principles.

---

## ⚡ Features

- **Authentication & RBAC**: JWT access/refresh tokens with role-based access control (`customer` & `admin`).
- **Catalog & Categories**: 100 seeded products with categories, tags, pricing, and stock management.
- **Search & Filter**: Real-time debounced live typing search across product names, brands, descriptions, and categories.
- **Cart & Steppers**: Multi-item quantity increment/decrement, coupon discounts, and instant global floating toast notifications.
- **Quick View**: Fast interactive preview modal on product cards.
- **Checkout & Gateways**: Delivery address forms, 1-Click "Back to Cart", Cash on Delivery (COD) and Razorpay (UPI, Cards, NetBanking) simulation.
- **Order Management & Tracking**: Real-time order history, visual delivery progress stepper, print invoice, and glassmorphism order cancellation dialog.
- **Admin Dashboard**: Analytics summary, orders fulfillment, and inventory audit logs.
- **Responsive UI**: Modern Dark Mode aesthetic with CSS variables and glassmorphism effects.

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router DOM, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose, Zod, JWT, Bcrypt.js, CORS, Helmet, Rate-Limit.
- **Database**: MongoDB (Atlas / Local).

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update MONGO_URI in .env if using Atlas
npm run seed:clean100   # Seeds 100 products and admin credentials
npm run dev             # Starts backend on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev             # Starts frontend on http://localhost:5173
```

---

## 🔐 Default Credentials

- **Admin Account**: `admin@ecommerce.com` / `Admin@123456`
- **Customer Account**: Register via `/register` or login via `/login`

---

## 📄 License
MIT License.
