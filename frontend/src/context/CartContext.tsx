import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ICart } from '../types';
import { CartService } from '../services/ecommerce.service';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: ICart | null;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartToast, setCartToast] = useState<{ message: string; sub?: string } | null>(null);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await CartService.getCart();
      if (res?.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const res = await CartService.addToCart(productId, quantity);
      if (res?.data) {
        setCart(res.data);
        const addedItem = res.data.items.find((it: any) => (it.product?._id || it.product) === productId);
        const itemName = addedItem?.name || 'Item';
        setCartToast({
          message: `Added to Bag!`,
          sub: `${itemName} (Qty: ${quantity})`,
        });
        setTimeout(() => setCartToast(null), 3500);
      }
    } catch (err: any) {
      console.error('Error adding to cart', err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const res = await CartService.updateCartItem(productId, quantity);
    if (res?.data) setCart(res.data);
  };

  const removeFromCart = async (productId: string) => {
    const res = await CartService.removeCartItem(productId);
    if (res?.data) setCart(res.data);
  };

  const applyCoupon = async (code: string) => {
    const res = await CartService.applyCoupon(code);
    if (res?.data) setCart(res.data);
  };

  const removeCoupon = async () => {
    const res = await CartService.removeCoupon();
    if (res?.data) setCart(res.data);
  };

  const clearCart = async () => {
    const res = await CartService.clearCart();
    if (res?.data) setCart(res.data);
  };

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart,
        fetchCart,
        cartCount,
      }}
    >
      {children}

      {/* Global Add to Cart Toast Popup */}
      {cartToast && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 90,
            right: 24,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #181d2d 0%, #111522 100%)',
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            maxWidth: 360,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.2)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{cartToast.message}</div>
            {cartToast.sub && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{cartToast.sub}</div>}
          </div>
          <a
            href="/cart"
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--primary)',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            View Bag →
          </a>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
