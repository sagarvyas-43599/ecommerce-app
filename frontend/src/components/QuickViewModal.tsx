import React from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import type { IProduct } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface QuickViewModalProps {
  product: IProduct | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          maxWidth: 800,
          width: '100%',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #181d2d 0%, #0d121f 100%)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 30,
          padding: 30,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={18} />
        </button>

        {/* Product Image Preview */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0d14', borderRadius: 'var(--radius-md)', padding: 20 }}>
          <img
            src={primaryImage}
            alt={product.name}
            style={{ width: '100%', maxHeight: 280, objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
            }}
          />
        </div>

        {/* Product Quick Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="badge badge-primary" style={{ width: 'fit-content', marginBottom: 10, fontSize: '0.75rem' }}>
            {product.brand}
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>
            {product.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={15} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.ratingsAverage.toFixed(1)}</span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 24, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
            <button
              onClick={() => {
                addToCart(product._id, 1);
                onClose();
              }}
              disabled={product.stock <= 0}
              className="btn btn-primary"
              style={{ flex: 1, padding: '12px 18px', fontSize: '0.9rem' }}
            >
              <ShoppingBag size={18} /> Add to Bag
            </button>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="btn btn-secondary"
              style={{ padding: 12, color: inWishlist ? 'var(--secondary)' : '#fff' }}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={inWishlist ? 'var(--secondary)' : 'none'} />
            </button>
            <Link
              to={`/products/${product.slug || product._id}`}
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '12px 16px', fontSize: '0.9rem' }}
              title="View full details"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
