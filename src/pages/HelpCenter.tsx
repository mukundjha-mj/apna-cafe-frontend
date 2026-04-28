import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, MessageCircle } from 'lucide-react';

export default function HelpCenter() {
  const navigate = useNavigate();

  const faqs = [
    { q: 'How do I track my order?', a: 'You can track your order status in real-time from the Orders tab at the bottom navigation bar.' },
    { q: 'Can I cancel my order?', a: 'Orders can only be cancelled before they are accepted by the cafe. Once preparation starts, cancellation is not possible.' },
    { q: 'How does the wallet work?', a: 'Your wallet balance can be used to pay for orders during checkout. You can earn wallet balance by referring friends.' },
    { q: 'Is there a minimum order amount?', a: 'No, there is no minimum order amount for dine-in or takeaway. Delivery may have a minimum requirement depending on your location.' },
  ];

  return (
    <div className="page animate-fade-in" id="help-center-page">
      <div className="page-header" style={{ padding: '1.5rem 1.25rem 1rem' }}>
        <button className="page-header-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Help Center</h2>
        <div style={{ width: 42 }}></div>
      </div>

      <div style={{ padding: '0 1.25rem 2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #1f2937, #111827)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>Need Live Help?</h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Our support team is available 24/7</p>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageCircle size={24} />
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Frequently Asked Questions</h3>
        
        <div className="stack" style={{ gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-cream)' }}>{faq.q}</h4>
                <ChevronDown size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
