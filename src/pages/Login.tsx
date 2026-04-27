import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { loginUser, clearError } from '../store/authSlice';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Coffee } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-hero auth-hero-sm">
        <div className="auth-hero-bg">
          <div className="auth-hero-circle auth-hero-circle-1" />
          <div className="auth-hero-circle auth-hero-circle-2" />
        </div>
        <div className="auth-hero-content">
          <div className="auth-logo-icon auth-logo-icon-sm">
            <Coffee size={28} />
          </div>
          <h1 className="auth-brand" style={{ fontSize: '1.25rem' }}>Apna Cafe</h1>
        </div>
      </div>

      <div className="auth-body">
        <button
          className="page-header-icon"
          onClick={() => navigate('/welcome')}
          style={{ marginBottom: '0.5rem' }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Welcome Back 👋
        </h2>
        <p style={{ color: 'var(--typo-200)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          Sign in to continue ordering
        </p>

        {displayError && (
          <div style={{
            background: '#fef2f2', color: '#ef4444', padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 500,
            marginBottom: '1rem', border: '1px solid #fecaca',
          }}>
            {displayError}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="input auth-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                id="login-email"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={18} className="auth-input-icon" />
              <input
                type={showPwd ? 'text' : 'password'}
                className="input auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                id="login-password"
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPwd(!showPwd)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <a href="#" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Forgot password?</a>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button className="btn-outline auth-social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button className="btn-outline auth-social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--typo-200)' }}>
          Don't have an account? <Link to="/signup" style={{ fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
