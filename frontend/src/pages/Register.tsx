import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};

    // Full Name validation (Matching label exact capitalization)
    if (!name.trim()) {
      errs.name = 'Full Name is required';
    } else if (name.trim().length < 3) {
      errs.name = 'Full Name must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Mobile Number validation
    if (!phoneNumber.trim()) {
      errs.phoneNumber = 'Mobile Number is required';
    } else if (phoneNumber.trim().length < 10) {
      errs.phoneNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Password validation
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(onlyDigits);
    if (fieldErrors.phoneNumber) setFieldErrors({ ...fieldErrors, phoneNumber: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phoneNumber: phoneNumber.trim() || undefined,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 460, margin: '60px auto', padding: '0 20px' }}>
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
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join Nexus Store for fast checkout & rewards</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.9rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Full Name</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: fieldErrors.name ? '1px solid var(--danger)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', gap: 10 }}>
              <User size={18} color={fieldErrors.name ? 'var(--danger)' : 'var(--text-muted)'} />
              <input
                type="text"
                placeholder="Enter your full name (min 3 chars)"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                }}
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', fontSize: '0.95rem' }}
              />
            </div>
            {fieldErrors.name && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{fieldErrors.name}</p>}
          </div>

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
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Mobile Number</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: fieldErrors.phoneNumber ? '1px solid var(--danger)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', gap: 10 }}>
              <Phone size={18} color={fieldErrors.phoneNumber ? 'var(--danger)' : 'var(--text-muted)'} />
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', fontSize: '0.95rem' }}
              />
            </div>
            {fieldErrors.phoneNumber && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{fieldErrors.phoneNumber}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: fieldErrors.password ? '1px solid var(--danger)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', gap: 10 }}>
              <Lock size={18} color={fieldErrors.password ? 'var(--danger)' : 'var(--text-muted)'} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
