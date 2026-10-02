import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { OrderService } from '../services/ecommerce.service';
import type { IOrder } from '../types';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await OrderService.getMyOrders();
        if (res?.data) setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}>Loading orders...</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: 30 }}>
        My Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Explore products and place your first order.</p>
          <Link to="/products" className="btn btn-primary">
            Explore Store
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="glass-panel"
              style={{
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{order.orderNumber}</span>
                  <span className={`badge ${order.orderStatus === 'delivered' ? 'badge-success' : 'badge-primary'}`}>
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Placed on {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
