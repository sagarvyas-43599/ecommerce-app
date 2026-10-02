import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { ApiResponse } from '../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<any, ApiResponse<any>>('/admin/dashboard-stats');
        if (res?.data) setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}>Loading admin metrics...</div>;
  }

  const { overview, recentOrders } = stats || {};

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
        <ShieldCheck size={32} color="var(--primary)" />
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>
          Admin Overview & Analytics
        </h1>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Revenue</span>
            <DollarSign size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
            ₹{overview?.totalRevenue?.toLocaleString('en-IN') || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Orders</span>
            <Package size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {overview?.totalOrders || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Customers</span>
            <Users size={20} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {overview?.totalUsers || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Low Stock Items</span>
            <AlertTriangle size={20} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: overview?.lowStockCount > 0 ? 'var(--warning)' : 'var(--text-main)' }}>
            {overview?.lowStockCount || 0}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-panel" style={{ padding: 30 }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Recent Customer Orders</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: 12 }}>Order #</th>
                <th style={{ padding: 12 }}>Customer</th>
                <th style={{ padding: 12 }}>Amount</th>
                <th style={{ padding: 12 }}>Status</th>
                <th style={{ padding: 12 }}>Paid</th>
                <th style={{ padding: 12 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((ord: any) => (
                <tr key={ord._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>{ord.orderNumber}</td>
                  <td style={{ padding: 12 }}>{ord.user?.name || 'Customer'}</td>
                  <td style={{ padding: 12, fontWeight: 700 }}>₹{ord.totalAmount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: 12 }}>
                    <span className="badge badge-primary">{ord.orderStatus}</span>
                  </td>
                  <td style={{ padding: 12 }}>{ord.isPaid ? '✅ Yes' : '⏳ Pending'}</td>
                  <td style={{ padding: 12, color: 'var(--text-muted)' }}>{new Date(ord.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
