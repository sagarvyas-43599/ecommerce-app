import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, XCircle, AlertTriangle, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { OrderService } from '../services/ecommerce.service';
import type { IOrder } from '../types';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await OrderService.getOrderById(id);
      if (res?.data) setOrder(res.data);
    } catch (err) {
      console.error('Failed to load order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleConfirmCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await OrderService.cancelOrder(order._id, 'Cancelled by customer');
      if (res?.data) {
        setOrder(res.data);
        setShowConfirmModal(false);
        setToastMessage({ type: 'success', text: 'Order cancelled successfully. Inventory has been restored.' });
      }
    } catch (err: any) {
      setShowConfirmModal(false);
      setToastMessage({ type: 'error', text: err.message || 'Failed to cancel order' });
    } finally {
      setCancelling(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <h2>Order not found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: 20 }}>
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 80px' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      {toastMessage && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000,
            background: toastMessage.type === 'success' ? '#064e3b' : '#7f1d1d',
            color: '#fff',
            padding: '14px 22px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: `1px solid ${toastMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 size={20} color="#10b981" /> : <AlertTriangle size={20} color="#ef4444" />}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'transparent', border: 'none', color: '#fff', marginLeft: 8, cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Modern Cancellation Confirmation Modal */}
      {showConfirmModal && (
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
        >
          <div
            className="glass-panel animate-fade-in"
            style={{
              maxWidth: 460,
              width: '100%',
              padding: 30,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'linear-gradient(135deg, #181d2d 0%, #111522 100%)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: 12, borderRadius: '50%', color: 'var(--danger)' }}>
                <AlertTriangle size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Cancel this Order?</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID: {order.orderNumber}</p>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to cancel this order? Reserved items will be returned to inventory immediately and your refund/status will be updated.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-secondary"
                style={{ padding: '10px 18px', fontSize: '0.9rem' }}
                disabled={cancelling}
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#fff',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                }}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel" style={{ padding: 30, marginBottom: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 20, marginBottom: 24 }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Order Number</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>{order.orderNumber}</h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Print Invoice 📄
            </button>
            <span className={`badge ${order.orderStatus === 'delivered' ? 'badge-success' : order.orderStatus === 'cancelled' ? 'badge-danger' : 'badge-primary'}`} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Status: {order.orderStatus.toUpperCase()}
            </span>
            {['placed', 'confirmed'].includes(order.orderStatus) && (
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={cancelling}
                className="btn btn-secondary"
                style={{ color: 'var(--danger)', fontSize: '0.85rem' }}
              >
                <XCircle size={16} /> Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Visual Order Progress Stepper */}
        {order.orderStatus !== 'cancelled' && (
          <div style={{ marginBottom: 30, background: 'rgba(255,255,255,0.02)', padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Live Delivery Tracking</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {[
                { key: 'placed', label: 'Order Placed', desc: 'Received' },
                { key: 'confirmed', label: 'Payment Confirmed', desc: 'Processing' },
                { key: 'shipped', label: 'Shipped via Express', desc: 'In Transit' },
                { key: 'delivered', label: 'Delivered', desc: 'Completed' },
              ].map((step, idx) => {
                const statuses = ['placed', 'confirmed', 'shipped', 'delivered'];
                const currentIdx = statuses.indexOf(order.orderStatus);
                const isCompleted = currentIdx >= idx;
                const isCurrent = currentIdx === idx;

                return (
                  <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: isCompleted ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                        color: isCompleted ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        marginBottom: 8,
                        boxShadow: isCurrent ? '0 0 15px var(--primary-glow)' : 'none',
                        border: isCurrent ? '2px solid #fff' : 'none',
                      }}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: isCompleted ? 700 : 500, color: isCompleted ? '#fff' : 'var(--text-muted)', textAlign: 'center' }}>
                      {step.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Items */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Items Ordered</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 30 }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
              <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'contain', background: '#0d121f', borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ fontWeight: 800 }}>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Shipping & Payment info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, borderTop: '1px solid var(--border-color)', paddingTop: 24 }}>
          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 8 }}>Delivery Address</h4>
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 8 }}>Payment Details</h4>
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Method: {order.paymentMethod.toUpperCase()} | Status: {order.paymentStatus.toUpperCase()}
            </p>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>
              Total Paid: ₹{order.totalAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
