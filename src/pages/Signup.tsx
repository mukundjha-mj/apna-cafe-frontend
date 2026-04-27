import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { signupUser, clearError } from '../store/authSlice';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, Coffee } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneVal] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (!agreed) {
      setLocalError('Please agree to the terms and conditions');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(signupUser({ email, password, name, phone }));
    if (signupUser.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-page" id="signup-page">
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
          Create Account ✨
        </h2>
        <p style={{ color: 'var(--typo-200)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          Join Apna Cafe and start ordering
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

        <form onSubmit={handleSignup}>
          <div className="auth-input-group">
            <label className="auth-label">Full Name</label>
            <div className="auth-input-wrap">
              <User size={18} className="auth-input-icon" />
              <input
                type="text"
                className="input auth-input"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                id="signup-name"
              />
            </div>
          </div>

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
                id="signup-email"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Phone Number</label>
            <div className="auth-input-wrap">
              <Phone size={18} className="auth-input-icon" />
              <input
                type="tel"
                className="input auth-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhoneVal(e.target.value)}
                autoComplete="tel"
                id="signup-phone"
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
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                id="signup-password"
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

          <label className="auth-checkbox" style={{ marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              id="signup-terms"
            />
            <span className="auth-checkbox-custom" />
            <span style={{ fontSize: '0.78rem', color: 'var(--typo-300)' }}>
              I agree to the <a href="#" style={{ color: 'var(--primary-300)', fontWeight: 500 }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--primary-300)', fontWeight: 500 }}>Privacy Policy</a>
            </span>
          </label>

          <button
            type="submit"
            className="btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--typo-200)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
