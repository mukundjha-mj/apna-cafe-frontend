import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { updateProfile } from '../store/authSlice';
import { syncUserProfile } from '../lib/api';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, User, Phone, Mail, Lock, Check, Eye, EyeOff } from 'lucide-react';

export default function MyProfile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      // Clean up phone from DB to be 10 digits if it's messy
      const clean = user.phone.replace(/\D/g, '');
      const last10 = clean.length > 10 ? clean.slice(-10) : clean;
      setPhone('+91' + last10);
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    setMessage(null);
    
    const cleanPhone = phone.startsWith('+91') ? phone.slice(3) : phone;
    if (cleanPhone.length !== 10) {
      setMessage({ type: 'error', text: 'Phone number must be exactly 10 digits' });
      setIsUpdating(false);
      return;
    }
    
    try {
      // 1. Update PostgreSQL and Redux (Name & Phone)
      if (name !== user.name || phone !== user.phone) {
        await syncUserProfile({ id: user.id, name, phone, email: user.email });
        dispatch(updateProfile({ name, phone }));
      }

      // 2. Update Supabase (Metadata, Email & Password)
      const updateData: any = {
        data: { name, phone } // Always sync metadata
      };
      if (email !== user.email) updateData.email = email;
      if (password) updateData.password = password;

      const { error } = await supabase.auth.updateUser(updateData);
      if (error) throw error;

      if (updateData.email) {
        setMessage({ type: 'success', text: 'Profile updated. Please check your new email for verification.' });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
      
      if (password) setPassword(''); // Clear password field after success

    } catch (err: any) {
      console.error('Update failed:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page animate-fade-in" id="my-profile-page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', marginBottom: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', color: 'var(--typo-300)' }}>
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Profile</h2>
      </div>

      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: 'var(--radius-lg)', 
            background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
          }}>
            {message.text}
          </div>
        )}

        <div className="input-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Full Name</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <User size={20} color="var(--primary)" />
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Enter your name" 
                style={{ background: 'none', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1rem' }} 
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Phone Number</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Phone size={20} color="var(--primary)" />
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem' }}>+91</span>
              <input 
                type="tel" 
                value={phone.startsWith('+91') ? phone.slice(3) : phone} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone('+91' + val);
                }} 
                placeholder="10-digit number" 
                style={{ background: 'none', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1rem' }} 
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Mail size={20} color="var(--primary)" />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter email address" 
                style={{ background: 'none', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1rem' }} 
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>New Password (Leave blank to keep current)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Lock size={20} color="var(--primary)" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter new password" 
                style={{ background: 'none', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1rem' }} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isUpdating}
          style={{ 
            width: '100%', 
            padding: '1.15rem', 
            borderRadius: 'var(--radius-xl)', 
            fontWeight: 800, 
            fontSize: '1rem', 
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            boxShadow: '0 10px 20px rgba(255,118,34,0.15)'
          }}
        >
          {isUpdating ? 'Updating...' : <><Check size={20} /> Update Profile</>}
        </button>
      </form>
    </div>
  );
}
