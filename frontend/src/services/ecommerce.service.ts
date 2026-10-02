import { api } from './api';
import type { ApiResponse, IProduct, ICategory, ICart, IWishlist, IOrder, IUser, IReview } from '../types';

export const AuthService = {
  login: (data: any) => api.post<any, ApiResponse<{ user: IUser; accessToken: string; refreshToken: string }>>('/users/login', data),
  register: (data: any) => api.post<any, ApiResponse<{ user: IUser; accessToken: string; refreshToken: string }>>('/users/register', data),
  logout: () => api.post<any, ApiResponse<null>>('/users/logout'),
  getProfile: () => api.get<any, ApiResponse<IUser>>('/users/me'),
  updateProfile: (data: any) => api.put<any, ApiResponse<IUser>>('/users/me', data),
  addAddress: (data: any) => api.post<any, ApiResponse<any>>('/users/address', data),
  deleteAddress: (id: string) => api.delete<any, ApiResponse<any>>(`/users/address/${id}`),
};

export const ProductService = {
  getProducts: (params?: Record<string, any>) => api.get<any, ApiResponse<IProduct[]>>('/products', { params }),
  getProductByIdOrSlug: (idOrSlug: string) => api.get<any, ApiResponse<IProduct>>(`/products/${idOrSlug}`),
  getCategories: () => api.get<any, ApiResponse<ICategory[]>>('/categories'),
};

export const CartService = {
  getCart: () => api.get<any, ApiResponse<ICart>>('/cart'),
  addToCart: (productId: string, quantity = 1) => api.post<any, ApiResponse<ICart>>('/cart/items', { productId, quantity }),
  updateCartItem: (productId: string, quantity: number) => api.put<any, ApiResponse<ICart>>(`/cart/items/${productId}`, { quantity }),
  removeCartItem: (productId: string) => api.delete<any, ApiResponse<ICart>>(`/cart/items/${productId}`),
  applyCoupon: (code: string) => api.post<any, ApiResponse<ICart>>('/cart/coupon', { code }),
  removeCoupon: () => api.delete<any, ApiResponse<ICart>>('/cart/coupon'),
  clearCart: () => api.delete<any, ApiResponse<ICart>>('/cart/clear'),
};

export const WishlistService = {
  getWishlist: () => api.get<any, ApiResponse<IWishlist>>('/wishlist'),
  toggleWishlist: (productId: string) => api.post<any, ApiResponse<IWishlist>>(`/wishlist/toggle/${productId}`),
};

export const OrderService = {
  createOrder: (data: { shippingAddress: any; paymentMethod: string; couponCode?: string }) =>
    api.post<any, ApiResponse<IOrder>>('/orders', data),
  getMyOrders: (params?: any) => api.get<any, ApiResponse<IOrder[]>>('/orders/my-orders', { params }),
  getOrderById: (id: string) => api.get<any, ApiResponse<IOrder>>(`/orders/${id}`),
  cancelOrder: (id: string, reason?: string) => api.post<any, ApiResponse<IOrder>>(`/orders/${id}/cancel`, { reason }),
};

export const PaymentService = {
  createStripeIntent: (orderId: string) => api.post<any, ApiResponse<any>>('/payments/stripe/create-intent', { orderId }),
  createRazorpayOrder: (orderId: string) => api.post<any, ApiResponse<any>>('/payments/razorpay/create-order', { orderId }),
  verifyRazorpay: (data: any) => api.post<any, ApiResponse<any>>('/payments/razorpay/verify', data),
};

export const ReviewService = {
  getProductReviews: (productId: string) => api.get<any, ApiResponse<IReview[]>>(`/reviews/product/${productId}`),
  addReview: (productId: string, data: { rating: number; title: string; comment: string }) =>
    api.post<any, ApiResponse<IReview>>(`/reviews/product/${productId}`, data),
};
