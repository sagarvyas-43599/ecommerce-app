import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Plus, Minus, Loader2, Eye } from 'lucide-react';
import type { IProduct } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { cart, addToCart, updateQuantity } = useCart();
  const [adding, setAdding] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const inWishlist = isInWishlist(product._id);

  // Check if item is already in cart and get its quantity
  const cartItem = cart?.items?.find((item) => {
    if (!item || !item.product) return false;
    const prodId = typeof item.product === 'object' && item.product !== null ? item.product._id : item.product;
    return prodId === product?._id;
  });
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (adding || product.stock <= 0) return;
    setAdding(true);
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAdding(false), 500);
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentQuantity >= product.stock) return;
    await updateQuantity(product._id, currentQuantity + 1);
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    await updateQuantity(product._id, currentQuantity - 1);
  };

  const mainImage =
    product.images.find((img) => img.isMain)?.url ||
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}
    >
      {/* Top Image Banner */}
      <div style={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden', background: '#0e1320' }}>
        <Link to={`/products/${product.slug || product._id}`}>
          <img
            src={mainImage}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: 10,
              transition: 'transform 0.5s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.06)')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent && (
          <span
            className="badge badge-warning"
            style={{ position: 'absolute', top: 12, left: 12, fontWeight: 800 }}
          >
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist & Quick View Buttons */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product._id);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(10, 13, 20, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: inWishlist ? 'var(--secondary)' : '#fff',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease',
            }}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={inWishlist ? 'var(--secondary)' : 'none'} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(10, 13, 20, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease',
            }}
            title="Quick View"
          >
            <Eye size={17} />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {product.brand}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {product.ratingsAverage.toFixed(1)}
            </span>
          </div>
        </div>

        <Link to={`/products/${product.slug || product._id}`}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: 12,
              lineHeight: 1.4,
              height: 44,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.compareAtPrice && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Interactive Add to Cart or Quantity Stepper */}
          {product.stock <= 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600 }}>
              Sold Out
            </span>
          ) : currentQuantity > 0 ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid var(--primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 6px',
              }}
            >
              <button
                onClick={handleDecrement}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: 20, textAlign: 'center', color: 'var(--primary)' }}>
                {currentQuantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={currentQuantity >= product.stock}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={adding}
              className="btn btn-primary"
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                gap: 6,
                minWidth: 80,
              }}
            >
              {adding ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Adding
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Add
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </div>
  );
};

