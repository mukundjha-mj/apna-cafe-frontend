import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, MapPin, Plus, Home, Briefcase, Trash2 } from 'lucide-react';
import AddAddressModal from '../components/AddAddressModal';
import type { RootState } from '../store/store';
import { API_URL } from '../lib/api';

export default function SavedAddresses() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/addresses/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleSaveAddress = async (newAddress: any) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/addresses/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      if (data.success) {
        fetchAddresses();
      }
    } catch (err) {
      console.error('Failed to save address', err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/addresses/${user.id}/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchAddresses();
      }
    } catch (err) {
      console.error('Failed to delete address', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Home': return Home;
      case 'Work': return Briefcase;
      default: return MapPin;
    }
  };

  return (
    <div className="page animate-fade-in" id="saved-addresses-page">
      <AddAddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
      />

      <div className="page-header" style={{ padding: '1.5rem 1.25rem 1rem' }}>
        <button className="page-header-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Saved Addresses</h2>
        <div style={{ width: 42 }}></div>
      </div>

      <div style={{ padding: '0 1.25rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            Loading addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(255,255,255,0.1)', marginTop: '1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <MapPin size={32} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Addresses Saved</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add a delivery location to checkout faster.</p>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '0.75rem 1.5rem' }}>
              Add New Address
            </button>
          </div>
        ) : (
          <div className="stack" style={{ gap: '1rem', marginTop: '1rem' }}>
            {addresses.map((addr) => {
              const Icon = getIcon(addr.type);
              return (
                <div key={addr.id} style={{ 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.25rem', 
                  border: addr.isDefault ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  position: 'relative'
                }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    background: addr.isDefault ? 'var(--primary-glow)' : 'rgba(255,255,255,0.05)', 
                    color: addr.isDefault ? 'var(--primary)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{addr.type}</h4>
                      {addr.isDefault && <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Default</span>}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, paddingRight: '2rem' }}>{addr.address}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ position: 'absolute', right: '1rem', top: '1.25rem', color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {addresses.length > 0 && (
          <button 
            className="btn-primary btn-full btn-lg" 
            onClick={() => setIsModalOpen(true)}
            style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} /> Add New Address
          </button>
        )}
      </div>
    </div>
  );
}
