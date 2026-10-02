import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistProducts } = useWishlist();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  // Sync searchTerm when URL search param changes externally (e.g. Back button or category click)
  useEffect(() => {
    const currentParam = searchParams.get('search') || '';
    if (currentParam !== searchTerm && (location.pathname === '/products' || currentParam !== '')) {
      setSearchTerm(currentParam);
    }
  }, [searchParams, location.pathname]);

  // Real-time live search on typing / backspacing with 300ms debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = searchTerm.trim();
      if (trimmed) {
        navigate(`/products?search=${encodeURIComponent(trimmed)}`, { replace: location.pathname === '/products' });
      } else {
        // If user cleared via backspace while on /products, restore all products without search filter
        if (location.pathname === '/products' && searchParams.has('search')) {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('search');
          const queryStr = newParams.toString();
          navigate(queryStr ? `/products?${queryStr}` : '/products', { replace: true });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/products');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (location.pathname === '/products') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      const queryStr = newParams.toString();
      navigate(queryStr ? `/products?${queryStr}` : '/products');
    } else {
      navigate('/products');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 20px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 0 15px var(--primary-glow)',
          }}>
            ⚡
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #fff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              NEXUS
            </span>
            <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.4rem' }}>STORE</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 500 }} className="nav-search-form">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            gap: 10,
          }}>
            <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                width: '100%',
                fontSize: '0.9rem',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 2, cursor: 'pointer' }}
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>

        {/* Nav Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/products" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            Browse Store
          </Link>

          {/* Wishlist Icon */}
          <Link to="/wishlist" style={{ position: 'relative', color: 'var(--text-main)', padding: 8 }}>
            <Heart size={22} />
            {wishlistProducts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: 2,
                right: 2,
                background: 'var(--secondary)',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {wishlistProducts.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" style={{ position: 'relative', color: 'var(--text-main)', padding: 8 }}>
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 2,
                right: 2,
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px var(--primary-glow)',
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}>
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    width: 220,
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    zIndex: 100,
                  }}
                >
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        color: 'var(--primary)',
                      }}
                    >
                      <ShieldCheck size={18} /> Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                    }}
                  >
                    <Package size={18} /> My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--danger)',
                      background: 'transparent',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
