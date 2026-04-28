import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="page animate-fade-in" id="contact-page">
      <div className="page-header" style={{ padding: '1.5rem 1.25rem 1rem' }}>
        <button className="page-header-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Contact Us</h2>
        <div style={{ width: 42 }}></div>
      </div>

      <div style={{ padding: '0 1.25rem 2rem' }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Phone size={18} />
            </div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Call Us</h4>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.25rem' }}>+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );
}
