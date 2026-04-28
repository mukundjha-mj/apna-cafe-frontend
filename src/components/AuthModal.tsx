import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User as UserIcon, Phone, X, Eye, EyeOff } from 'lucide-react';
import type { AppDispatch, RootState } from '../store/store';
import { loginUser, signupUser, clearError, loginWithGoogle } from '../store/authSlice';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    if (isLogin) {
      if (!email.trim() || !password.trim()) return setLocalError('Fields are required');
      const res = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(res)) onSuccess();
    } else {
      if (!email.trim() || !password.trim() || !name.trim() || !phone.trim()) 
        return setLocalError('All fields are required');
      
      const cleanPhone = phone.startsWith('+91') ? phone.slice(3) : phone;
      if (cleanPhone.length !== 10) {
        return setLocalError('Phone number must be exactly 10 digits');
      }

      const res = await dispatch(signupUser({ email, password, name, phone }));
      if (signupUser.fulfilled.match(res)) onSuccess();
    }
  };

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  const displayError = localError || error;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Login to place your order' : 'Join us for a premium cafe experience'}</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(true); setLocalError(''); }}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(false); setLocalError(''); }}
          >
            Signup
          </button>
        </div>

        {displayError && (
          <div className="auth-error">{displayError}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <UserIcon size={18} className="input-icon" />
                <input 
                  type="text" placeholder="Full Name" className="input" 
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <Phone size={18} className="input-icon" />
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', paddingLeft: '3.2rem', height: '48px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginRight: '0.4rem' }}>+91</span>
                  <input 
                    type="tel" 
                    placeholder="10-digit number" 
                    className="input" 
                    style={{ paddingLeft: 0, background: 'transparent', border: 'none' }}
                    value={phone.startsWith('+91') ? phone.slice(3) : phone} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone('+91' + val);
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" placeholder="Email Address" className="input" 
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type={showPwd ? 'text' : 'password'} placeholder="Password" className="input" 
              value={password} onChange={e => setPassword(e.target.value)}
            />
            <button 
              type="button" className="pwd-toggle" 
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Signup')}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '1.5rem 0' }}>
          <span>or continue with</span>
        </div>

        <button className="social-btn google" onClick={handleGoogleLogin} style={{ marginBottom: '1.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Continue with Google
        </button>

        <p className="auth-footer">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Signup Now' : 'Login Now'}
          </span>
        </p>
      </div>

      <style>{`
        .auth-modal {
          max-width: 400px;
          padding: 3rem 2rem 2.5rem;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.05);
          color: var(--text-cream);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .auth-modal-header h2 {
          margin-bottom: 0.5rem;
          font-size: 1.75rem;
        }
        .auth-modal-header p {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 2rem;
        }
        .auth-tabs {
          display: flex;
          background: rgba(255,255,255,0.05);
          border-radius: var(--radius-md);
          padding: 0.25rem;
          margin-bottom: 1.5rem;
        }
        .auth-tab {
          flex: 1;
          padding: 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          background: transparent;
        }
        .auth-tab.active {
          background: var(--bg-card);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
        .auth-modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .input-group {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary);
          opacity: 0.7;
        }
        .auth-modal-form .input {
          padding-left: 3rem;
        }
        .pwd-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          color: var(--text-muted);
          padding: 0;
        }
        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .auth-footer {
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .auth-footer span {
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
