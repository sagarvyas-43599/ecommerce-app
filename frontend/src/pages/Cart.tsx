import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, loading } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      await applyCoupon(couponCode.trim());
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  if (loading && !cart) {
    return <div style={{ textAlign: 'center', padding: 100 }}>Loading your cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div className="glass-panel" style={{ padding: '60px 40px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>
            Looks like you haven't added anything to your cart yet. Discover high-end tech products now.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: 30 }}>
        Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
        {/* Cart Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cart.items.map((item) => {
            const productId: string =
              typeof item.product === 'object' && item.product !== null
                ? (item.product as any)._id
                : (item.product as string);

            if (!productId) return null;
            return (
              <div
                key={item._id || productId}
                className="glass-panel"
                style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 80, height: 80, objectFit: 'contain', background: '#0d121f', borderRadius: 'var(--radius-sm)', padding: 6 }}
                />

                <div style={{ flex: 1, minWidth: 180 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>{item.name}</h3>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <button
                    onClick={() => updateQuantity(productId, item.quantity - 1)}
                    style={{ padding: '8px 12px', color: 'var(--text-main)', background: 'transparent' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 8px', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(productId, item.quantity + 1)}
                    style={{ padding: '8px 12px', color: 'var(--text-main)', background: 'transparent' }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => removeFromCart(productId)}
                    style={{ color: 'var(--danger)', background: 'transparent', marginTop: 6, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupon */}
        <div className="glass-panel" style={{ padding: 30 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>
            Order Summary
          </h2>

          {/* Coupon Input */}
          <div style={{ marginBottom: 24 }}>
            {cart.couponCode ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>{cart.couponCode} Applied</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Discount: -₹{cart.discount.toLocaleString('en-IN')}</div>
                </div>
                <button onClick={removeCoupon} style={{ color: 'var(--danger)', background: 'transparent', fontSize: '0.85rem' }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Coupon code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                />
                <button type="submit" className="btn btn-secondary" disabled={couponLoading}>
                  <Tag size={16} /> Apply
                </button>
              </form>
            )}
            {couponError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 6 }}>{couponError}</p>}
          </div>

          {/* Summary Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>₹{cart.subtotal.toLocaleString('en-IN')}</span>
            </div>

            {cart.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                <span>Coupon Savings</span>
                <span style={{ fontWeight: 600 }}>-₹{cart.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Estimated Shipping</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>
                {cart.subtotal > 1000 ? 'FREE' : '₹50'}
              </span>
            </div>
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 30 }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total Amount</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{cart.totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px 20px', fontSize: '1.05rem' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
