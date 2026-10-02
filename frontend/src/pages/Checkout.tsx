import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, DollarSign, CheckCircle2, Lock, ArrowLeft, Smartphone, Building2, Wallet, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderService, PaymentService } from '../services/ecommerce.service';

export const Checkout: React.FC = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.addresses?.[0]?.street || '42 MG Road, Indiranagar',
    city: user?.addresses?.[0]?.city || 'Bengaluru',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    postalCode: user?.addresses?.[0]?.postalCode || '560038',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [razorpayTab, setRazorpayTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8921 7843 9012');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('890');
  const [cardName, setCardName] = useState(user?.name || 'Sagar Kumar');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [submitting, setSubmitting] = useState(false);
  const [paymentStage, setPaymentStage] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      if (paymentMethod === 'razorpay') {
        setPaymentStage('processing');
        // Simulate gateway interactive processing
        await new Promise((res) => setTimeout(res, 1200));
      }

      // 1. Create order in Backend (atomically reserves inventory)
      const res = await OrderService.createOrder({
        shippingAddress,
        paymentMethod,
        couponCode: cart.couponCode,
      });

      const createdOrder = res.data;

      // 2. Complete payment verification if online
      if (paymentMethod === 'razorpay') {
        const rzpRes = await PaymentService.createRazorpayOrder(createdOrder._id);
        await PaymentService.verifyRazorpay({
          orderId: createdOrder._id,
          razorpayOrderId: rzpRes?.data?.razorpayOrderId || `order_rzp_${Date.now()}`,
          razorpayPaymentId: `pay_${razorpayTab}_${Date.now()}`,
          razorpaySignature: 'mock_valid_signature',
        });
      }

      setPaymentStage('success');
      await fetchCart();
      
      setTimeout(() => {
        navigate(`/orders/${createdOrder._id}`);
      }, 500);
    } catch (err: any) {
      setPaymentStage('idle');
      setErrorMessage(err.message || 'Failed to complete order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '30px 20px 80px' }}>
      {/* Back to Cart Link */}
      <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => navigate('/cart')}
          style={{
            background: 'transparent',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.95rem',
            fontWeight: 600,
            padding: '6px 0',
          }}
        >
          <ArrowLeft size={18} /> Back to Cart
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
          Secure Checkout
        </h1>
        <span className="badge badge-success" style={{ gap: 6, padding: '6px 12px' }}>
          <ShieldCheck size={16} /> 256-bit Encrypted
        </span>
      </div>

      {errorMessage && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', padding: '14px 20px', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={20} /> {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30 }}>
        {/* Left: Shipping Address & Payment Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 1. Shipping Address */}
          <div className="glass-panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>1. Delivery Address</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Country</label>
                  <input
                    type="text"
                    disabled
                    value={shippingAddress.country}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#aaa', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="glass-panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>2. Payment Method</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* COD Option */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: paymentMethod === 'cod' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <DollarSign size={22} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 700 }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay with cash or UPI upon delivery</div>
                </div>
              </label>

              {/* Razorpay Online Option */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'razorpay' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: paymentMethod === 'razorpay' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                />
                <CreditCard size={22} color="var(--secondary)" />
                <div>
                  <div style={{ fontWeight: 700 }}>Razorpay Gateway (Instant Online Payment)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UPI (GPay / PhonePe / Paytm), Debit/Credit Cards & NetBanking</div>
                </div>
              </label>

              {/* Razorpay Sub-Options when selected */}
              {paymentMethod === 'razorpay' && (
                <div style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  marginTop: 4,
                }}>
                  {/* Tab Selectors */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
                    <button
                      type="button"
                      onClick={() => setRazorpayTab('upi')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: razorpayTab === 'upi' ? 'var(--primary)' : 'transparent',
                        color: razorpayTab === 'upi' ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Smartphone size={15} /> UPI App / ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setRazorpayTab('card')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: razorpayTab === 'card' ? 'var(--primary)' : 'transparent',
                        color: razorpayTab === 'card' ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <CreditCard size={15} /> Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setRazorpayTab('netbanking')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: razorpayTab === 'netbanking' ? 'var(--primary)' : 'transparent',
                        color: razorpayTab === 'netbanking' ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Building2 size={15} /> NetBanking
                    </button>
                  </div>

                  {/* Tab 1: UPI */}
                  {razorpayTab === 'upi' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobileNumber@upi or user@okaxis"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        {['@okhdfcbank', '@okaxis', '@ybl', '@paytm'].map((handle) => (
                          <button
                            type="button"
                            key={handle}
                            onClick={() => setUpiId(`user${handle}`)}
                            style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
                          >
                            {handle}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Cards */}
                  {razorpayTab === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 8921 7843 9012"
                          style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: NetBanking */}
                  {razorpayTab === 'netbanking' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select Popular Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Overview */}
        <div className="glass-panel" style={{ padding: 30, height: 'fit-content' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, maxHeight: 200, overflowY: 'auto' }}>
            {cart.items.map((item) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {cart.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--success)' }}>
                <span>Coupon Applied ({cart.couponCode})</span>
                <span>-₹{cart.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, marginTop: 12 }}>
              <span>Total Pay</span>
              <span style={{ color: 'var(--primary)' }}>₹{cart.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px 20px', fontSize: '1.05rem', display: 'flex', gap: 10, justifyContent: 'center' }}
            disabled={submitting}
          >
            {paymentStage === 'processing' ? (
              <>
                <div className="animate-spin" style={{ width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                Authorizing via Razorpay...
              </>
            ) : paymentStage === 'success' ? (
              <>
                <CheckCircle2 size={18} color="var(--success)" />
                Payment Success!
              </>
            ) : (
              <>
                <Lock size={18} />
                {paymentMethod === 'cod' ? 'Confirm & Place COD Order' : `Pay ₹${cart.totalPrice.toLocaleString('en-IN')} via Razorpay`}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
