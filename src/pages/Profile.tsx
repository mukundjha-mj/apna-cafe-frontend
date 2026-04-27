import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logoutUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, CreditCard, UserPlus, Globe, Phone, HelpCircle, FileText, Shield, Info, ChevronRight, LogOut } from 'lucide-react';

const profileMenuItems = [
  { icon: MapPin, label: 'Saved Addresses', color: '#FF7622' },
  { icon: CreditCard, label: 'Payment Methods', color: '#3b82f6' },
  { icon: UserPlus, label: 'Invite Friends', color: '#22C55E' },
  { icon: Globe, label: 'Language', value: 'English', color: '#8b5cf6' },
  { icon: Phone, label: 'Contact us', color: '#f59e0b' },
  { icon: HelpCircle, label: 'Help Center', color: '#06b6d4' },
  { icon: FileText, label: 'Term of Service', color: '#64748b' },
  { icon: Shield, label: 'Privacy Policy', color: '#ec4899' },
  { icon: Info, label: 'About App', color: '#6366f1' },
];

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/welcome', { replace: true });
  };

  return (
    <div className="page animate-fade-in" id="profile-page">
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
            <li key={item.label} className="profile-list-item">
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
  );
}
