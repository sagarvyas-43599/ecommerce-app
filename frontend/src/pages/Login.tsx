import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email validation
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errs.password = 'Password is required';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await login({ email: email.trim().toLowerCase(), password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: 40, borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.5rem',
              margin: '0 auto 16px',
            }}
          >
            ⚡
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to continue to Nexus Store</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.9rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Email</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: fieldErrors.email ? '1px solid var(--danger)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', gap: 10 }}>
              <Mail size={18} color={fieldErrors.email ? 'var(--danger)' : 'var(--text-muted)'} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                }}
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', fontSize: '0.95rem' }}
              />
            </div>
            {fieldErrors.email && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{fieldErrors.email}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: fieldErrors.password ? '1px solid var(--danger)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', gap: 10 }}>
              <Lock size={18} color={fieldErrors.password ? 'var(--danger)' : 'var(--text-muted)'} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                }}
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', fontSize: '0.95rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0, cursor: 'pointer' }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {fieldErrors.password && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: 10, fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
