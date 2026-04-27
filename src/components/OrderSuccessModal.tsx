import { CheckCircle, Clock, MapPin, CreditCard, X } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: () => void;
  estimatedTime?: string;
  deliverTo?: string;
  amountPaid?: number;
  orderId?: string;
}

export default function OrderSuccessModal({
  isOpen,
  onClose,
  onTrackOrder,
  estimatedTime = '30mins',
  deliverTo = 'Pickup',
  amountPaid = 0,
}: OrderSuccessModalProps) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" id="order-success-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          animation: 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <CheckCircle size={44} color="#4ade80" />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-cream)', fontFamily: 'Playfair Display' }}>
          Yay! Your order<br />has been placed.
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Your order will be ready in approx.<br /><span style={{ color: 'var(--primary)', fontWeight: 700 }}>{estimatedTime}</span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Clock size={16} color="var(--primary)" />
              <span>Estimated time</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-cream)' }}>{estimatedTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <MapPin size={16} color="var(--primary)" />
              <span>Deliver to</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-cream)' }}>{deliverTo}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <CreditCard size={16} color="var(--primary)" />
              <span>Amount Paid</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>₹{amountPaid}</span>
          </div>
        </div>

        <button
          className="btn-primary btn-full btn-lg"
          onClick={onTrackOrder}
          style={{ borderRadius: '12px' }}
        >
          Track order
        </button>
      </div>
    </div>
  );
}
