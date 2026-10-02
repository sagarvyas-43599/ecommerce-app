import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

export const Wishlist: React.FC = () => {
  const { wishlistProducts, loading } = useWishlist();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}>Loading wishlist...</div>;
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: 30 }}>
        My Wishlist ({wishlistProducts.length})
      </h1>

      {wishlistProducts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
          <Heart size={48} color="var(--secondary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Bookmark items you love by clicking the heart icon.</p>
          <Link to="/products" className="btn btn-primary">
            Explore Store <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {wishlistProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
