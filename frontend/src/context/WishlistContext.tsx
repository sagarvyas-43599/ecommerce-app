import React, { createContext, useContext, useState, useEffect } from 'react';
import type { IProduct } from '../types';
import { WishlistService } from '../services/ecommerce.service';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistProducts: IProduct[];
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistProducts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await WishlistService.getWishlist();
      if (res?.data?.products) {
        setWishlistProducts(res.data.products as any);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (productId: string) => {
    await WishlistService.toggleWishlist(productId);
    await fetchWishlist();
  };

  const isInWishlist = (productId: string) => {
    return wishlistProducts.some((p) => p._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistProducts,
        loading,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
