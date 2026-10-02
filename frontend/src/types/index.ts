export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'seller';
  avatar?: string;
  phoneNumber?: string;
  addresses?: IAddress[];
}

export interface IAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: { _id: string; name: string; slug: string };
  isActive: boolean;
}

export interface IProductImage {
  url: string;
  publicId?: string;
  isMain?: boolean;
}

export interface IProductAttribute {
  name: string;
  value: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  category: ICategory | string;
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
  attributes?: IProductAttribute[];
  createdAt: string;
}

export interface ICartItem {
  _id?: string;
  product: IProduct | string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  totalPrice: number;
  couponCode?: string;
}

export interface IWishlist {
  _id: string;
  user: string;
  products: IProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface IOrderStatusHistory {
  status: string;
  comment?: string;
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser | string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  itemsTotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  couponApplied?: {
    code: string;
    discount: number;
  };
  totalAmount: number;
  paymentMethod: 'stripe' | 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  statusHistory: IOrderStatusHistory[];
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  trackingNumber?: string;
  cancelReason?: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  product: string;
  user: { _id: string; name: string; avatar?: string };
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
