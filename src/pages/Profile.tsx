import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logoutUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, UserPlus, Phone, HelpCircle, ChevronRight, LogOut, Wallet } from 'lucide-react';

const profileMenuItems = [
  { id: 'profile', icon: User, label: 'My Profile', color: '#6366f1', path: '/my-profile' },
  { id: 'wallet', icon: Wallet, label: 'My Wallet', color: '#FF7622', path: '/wallet' },
  { id: 'addresses', icon: MapPin, label: 'Saved Addresses', color: '#3b82f6', path: '/saved-addresses' },
  { id: 'invite', icon: UserPlus, label: 'Invite Friends', color: '#8b5cf6', path: '/wallet' },
  { id: 'contact', icon: Phone, label: 'Contact us', color: '#06b6d4', path: '/contact' },
  { id: 'help', icon: HelpCircle, label: 'Help Center', color: '#64748b', path: '/help' },
];

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/welcome', { replace: true });
  };

  const handleItemClick = (item: any) => {
    if (item.path) {
      navigate(item.path);
    } else {
      alert(`${item.label} feature is coming soon!`);
    }
  };

  return (
    <div className="page animate-fade-in" id="profile-page" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--bottom-nav-height))' }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '1rem 0 0.5rem' }}><h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile</h2></div>
        
        {/* Simplified User Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 0', marginBottom: '1rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #FF7622, #FFBE96)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 8px 16px rgba(255, 118, 34, 0.2)' }}>
            <User size={32} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{user?.email}</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)', padding: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {profileMenuItems.map(item => (
              <li 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', cursor: 'pointer', borderRadius: 'var(--radius-xl)', transition: 'all 0.2s' }}
                className="profile-item-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon size={20} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-cream)' }}>{item.label}</span>
                </div>
                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={handleLogout} 
          style={{ width: '100%', padding: '1.15rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#ef4444', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <LogOut size={20} /> Log out
        </button>
      </div>

      <footer style={{ marginTop: 'auto', padding: '2.5rem 0 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>© 2026 Apna Cafe. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <Link to="/privacy" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </footer>

      <style>{`
        .profile-item-hover:active {
          background: rgba(255,255,255,0.05);
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}



