import { CheckCircle, Clock, MapPin, CreditCard, X } from 'lucide-react';

interface OrderSuccessModalProps {
  onClose: () => void;
  onTrackOrder: () => void;
  estimatedTime?: string;
  deliverTo?: string;
  amountPaid?: number;
}

export default function OrderSuccessModal({
  onClose,
  onTrackOrder,
  estimatedTime = '30mins',
  deliverTo = 'Pickup',
  amountPaid = 0,
}: OrderSuccessModalProps) {
  return (
    <div className="modal-overlay" id="order-success-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#dcfce7', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
          animation: 'scaleIn 0.4s ease',
        }}>
          <CheckCircle size={40} color="#22C55E" />
        </div>

        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem', color: '#363A33' }}>
          Yay! Your order<br />has been placed.
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#91958E', marginBottom: '1.25rem' }}>
          Your order would be delivered in the<br />{estimatedTime} almost
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#91958E', fontSize: '0.8rem' }}>
              <Clock size={16} />
              <span>Estimated time</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{estimatedTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#91958E', fontSize: '0.8rem' }}>
              <MapPin size={16} />
              <span>Deliver to</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{deliverTo}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#91958E', fontSize: '0.8rem' }}>
              <CreditCard size={16} />
              <span>Amount Paid</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FF7622' }}>₹{amountPaid}</span>
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
