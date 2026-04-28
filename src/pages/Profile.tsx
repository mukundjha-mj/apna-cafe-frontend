import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logoutUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, UserPlus, Phone, HelpCircle, ChevronRight, LogOut, Wallet } from 'lucide-react';

const profileMenuItems = [
  { icon: Wallet, label: 'My Wallet', color: '#FF7622', path: '/wallet' },
  { icon: MapPin, label: 'Saved Addresses', color: '#3b82f6', path: '/saved-addresses' },
  { icon: UserPlus, label: 'Invite Friends', color: '#8b5cf6', path: '/wallet' },
  { icon: Phone, label: 'Contact us', color: '#06b6d4', path: '/contact' },
  { icon: HelpCircle, label: 'Help Center', color: '#64748b', path: '/help' },
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
        <div style={{ padding: '1rem 0 0.5rem' }}><h2>Profile</h2></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #FF7622, #FFBE96)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <User size={28} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Apna Cafe User'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--typo-200)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={12} /> {user?.phone || ''}</div>
            {user?.email && <div style={{ fontSize: '0.72rem', color: 'var(--typo-100)', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>}
          </div>
        </div>
        <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '0 1rem', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' }}>
          <ul className="profile-list">
            {profileMenuItems.map(item => (
              <li key={item.label} className="profile-list-item" onClick={() => handleItemClick(item)}>
                <div className="profile-list-left">
                  <div className="profile-list-icon" style={{ background: `${item.color}15`, color: item.color }}><item.icon size={18} /></div>
                  <span className="profile-list-text">{item.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {item.value && <span style={{ fontSize: '0.75rem', color: 'var(--typo-200)' }}>{item.value}</span>}
                  <ChevronRight size={16} color="var(--typo-100)" />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', padding: '0.85rem', background: 'var(--bg-white)', border: '1.5px solid #fee2e2', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
          <LogOut size={18} /> Log out
        </button>
      </div>

      <footer className="app-footer" style={{ marginTop: 'auto', paddingTop: '2rem', paddingBottom: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>© 2026 Apna Cafe. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <Link to="/privacy" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
