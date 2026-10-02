import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Truck } from 'lucide-react';
import { ProductService } from '../services/ecommerce.service';
import type { IProduct, ICategory } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          ProductService.getProducts({ isFeatured: true, limit: 8 }),
          ProductService.getCategories(),
        ]);

        if (prodRes?.data) setFeaturedProducts(prodRes.data);
        if (catRes?.data) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Hero Section */}
      <section
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: '60px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 40,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 60,
          background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
        }}
      >
        <div>
          <div
            className="badge badge-primary"
            style={{ marginBottom: 16, padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <Sparkles size={14} /> NEXT-GEN TECH STORE 2026
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              marginBottom: 20,
              letterSpacing: '-1px',
            }}
          >
            Discover Flagship <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Devices & Accessories
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 30, maxWidth: 480 }}>
            Shop authentic iPhones, audio gear, and luxury electronics with rapid checkout, live inventory tracking, and exclusive discounts.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Explore All Products <ArrowRight size={18} />
            </Link>
            <Link to="/products?category=electronics" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              Electronics
            </Link>
          </div>
        </div>

        {/* Hero Visual Mock */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"
            alt="Hero iPhone"
            style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </section>

      {/* Value Badges */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 60,
        }}
      >
        <div className="glass-panel" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: 12, borderRadius: 'var(--radius-sm)', color: 'var(--primary)' }}>
            <Truck size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700 }}>Express Delivery</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Free shipping on orders above ₹1,000</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: 12, borderRadius: 'var(--radius-sm)', color: 'var(--success)' }}>
            <Shield size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700 }}>100% Genuine</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Authentic direct from manufacturer</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.15)', padding: 12, borderRadius: 'var(--radius-sm)', color: 'var(--secondary)' }}>
            <Zap size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700 }}>Instant Checkout</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stripe & Razorpay integrated</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 20 }}>
          Shop by Category
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              className="glass-panel"
              style={{
                padding: '24px 20px',
                textAlign: 'center',
                transition: 'all 0.25s ease',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>{cat.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cat.description || 'View Products'}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700 }}>
              Featured Flagships
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Handpicked top-tier products ready to ship
            </p>
          </div>
          <Link to="/products" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            Loading products...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
