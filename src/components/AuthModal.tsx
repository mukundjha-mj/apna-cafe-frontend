import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User as UserIcon, Phone, X, Eye, EyeOff } from 'lucide-react';
import type { AppDispatch, RootState } from '../store/store';
import { loginUser, signupUser, clearError } from '../store/authSlice';

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
      const res = await dispatch(signupUser({ email, password, name, phone }));
      if (signupUser.fulfilled.match(res)) onSuccess();
    }
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
                <input 
                  type="tel" placeholder="Phone Number" className="input" 
                  value={phone} onChange={e => setPhone(e.target.value)}
                />
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
