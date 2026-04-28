import { useState } from 'react';
import { X, Navigation, MapPin } from 'lucide-react';
import { getCurrentPosition, reverseGeocode } from '../lib/geo';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: any) => void;
}

export default function AddAddressModal({ isOpen, onClose, onSave }: AddAddressModalProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationName, setLocationName] = useState('Bariarpur, Munger');
  
  // Form fields
  const [building, setBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [tag, setTag] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!building || !street) {
      alert('Please fill the required fields.');
      return;
    }
    
    const fullAddress = `${building}, ${street}${landmark ? `, Near ${landmark}` : ''}`;
    
    onSave({
      id: Date.now(),
      type: tag,
      address: fullAddress,
      isDefault: false
    });
    
    // Reset
    setBuilding('');
    setStreet('');
    setLandmark('');
    setLocationName('Bariarpur, Munger');
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ zIndex: 200 }}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden', height: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Add New Address</h2>
          <button 
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Address Form */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'var(--bg-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
            <MapPin size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Delivery Location</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{locationName}</p>
            </div>
          </div>

          <div className="stack" style={{ gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>House/Flat No. & Building Name *</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. House No. 12, Main Road" 
                value={building}
                onChange={e => setBuilding(e.target.value)}
              />
            </div>
            
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Street/Area/Locality *</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Bariarpur, Munger" 
                value={street}
                onChange={e => setStreet(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Landmark (Optional)</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Near Badi Durga Mandir" 
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Save As</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['Home', 'Work', 'Other'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTag(t as any)}
                    style={{ 
                      flex: 1, 
                      padding: '0.6rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: tag === t ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                      background: tag === t ? 'var(--primary-glow)' : 'transparent',
                      color: tag === t ? 'var(--primary)' : 'var(--text-cream)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button className="btn-primary btn-full btn-lg" onClick={handleSave}>Save Address</button>
        </div>
      </div>
    </div>
  );
}
