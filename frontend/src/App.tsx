import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { Wishlist } from './pages/Wishlist';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}>Authenticating...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin Guard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}>Authenticating...</div>;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/products/:idOrSlug" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Authenticated User Routes */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetail />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Only Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Comprehensive Professional E-Commerce Footer */}
              <footer style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(10, 13, 20, 0.95)', padding: '60px 20px 30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>
                    {/* Col 1: Brand info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--radius-sm)',
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                        }}>
                          ⚡
                        </div>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                          NEXUS<span style={{ color: 'var(--primary)' }}>STORE</span>
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 20 }}>
                        Your premier destination for authentic flagship electronics, high-end fashion, home essentials, and lifestyle accessories.
                      </p>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>100% Genuine</span>
                        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Fast Delivery</span>
                      </div>
                    </div>

                    {/* Col 2: Quick Shop Categories */}
                    <div>
                      <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Popular Categories</h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 0 }}>
                        <li><Link to="/products?category=smartphones" style={{ color: 'var(--text-muted)' }}>Smartphones & Tablets</Link></li>
                        <li><Link to="/products?category=electronics" style={{ color: 'var(--text-muted)' }}>Laptops & Audio Gear</Link></li>
                        <li><Link to="/products?category=fashion" style={{ color: 'var(--text-muted)' }}>Fashion & Apparel</Link></li>
                        <li><Link to="/products?category=footwear" style={{ color: 'var(--text-muted)' }}>Footwear & Sneakers</Link></li>
                        <li><Link to="/products?category=accessories" style={{ color: 'var(--text-muted)' }}>Watches & Accessories</Link></li>
                      </ul>
                    </div>

                    {/* Col 3: Customer Care */}
                    <div>
                      <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Customer Care</h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 0 }}>
                        <li><Link to="/orders" style={{ color: 'var(--text-muted)' }}>Track Your Order</Link></li>
                        <li><Link to="/cart" style={{ color: 'var(--text-muted)' }}>Shopping Bag</Link></li>
                        <li><Link to="/wishlist" style={{ color: 'var(--text-muted)' }}>My Wishlist</Link></li>
                        <li><span style={{ color: 'var(--text-dim)' }}>Free Shipping Policy</span></li>
                        <li><span style={{ color: 'var(--text-dim)' }}>7-Day Easy Returns</span></li>
                      </ul>
                    </div>

                    {/* Col 4: Payment & Security */}
                    <div>
                      <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>100% Secure Payments</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: 14 }}>
                        We support all major payment modes with bank-grade 256-bit encryption.
                      </p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>UPI (GPay / PhonePe)</span>
                        <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>Credit & Debit Cards</span>
                        <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>NetBanking</span>
                        <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>Cash on Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      © {new Date().getFullYear()} NEXUS Store. All rights reserved. Built for exceptional shopping experiences.
                    </p>
                    <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Privacy Policy</span>
                      <span style={{ color: 'var(--text-dim)' }}>Terms of Service</span>
                      <span style={{ color: 'var(--text-dim)' }}>Security</span>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
