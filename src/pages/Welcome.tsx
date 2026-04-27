import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="auth-page" id="welcome-page">
      <div className="auth-hero">
        <div className="auth-hero-bg">
          <div className="auth-hero-circle auth-hero-circle-1" />
          <div className="auth-hero-circle auth-hero-circle-2" />
          <div className="auth-hero-circle auth-hero-circle-3" />
        </div>
        <div className="auth-hero-content">
          <div className="auth-logo-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M4 10h12v8a4 4 0 01-4 4H8a4 4 0 01-4-4v-8z" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 12h1.5a2.5 2.5 0 010 5H16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 22h16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 7c0-1.5 2-1.5 2-3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.8"/>
              <path d="M11 6c0-1.5 2-1.5 2-3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
          <h1 className="auth-brand">Apna<span style={{ opacity: 0.85 }}>Cafe</span></h1>
          <p className="auth-tagline">Good Food • Good Mood</p>
        </div>
      </div>

      <div className="auth-body">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
          Welcome 👋
        </h2>
        <p style={{ color: 'var(--typo-200)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.6 }}>
          Order delicious pizzas, burgers, momos, shakes and more — delivered fresh to your door.
        </p>

        <button
          className="btn-primary btn-full btn-lg"
          onClick={() => navigate('/login')}
          style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          Log In <ArrowRight size={18} />
        </button>

        <button
          className="btn-secondary btn-full btn-lg"
          onClick={() => navigate('/signup')}
        >
          Create Account
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.72rem', color: 'var(--typo-100)' }}>
          By continuing, you agree to our <a href="#" style={{ color: 'var(--primary-300)', fontWeight: 500 }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--primary-300)', fontWeight: 500 }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
