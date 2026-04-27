import { useDispatch } from 'react-redux';
import { X, Truck, UtensilsCrossed } from 'lucide-react';
import { setOrderType, type OrderType } from '../store/menuSlice';
import CafeLogo from './CafeLogo';

interface ServiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceSelectionModal({ isOpen, onClose }: ServiceSelectionModalProps) {
  const dispatch = useDispatch();

  const handleSelection = (type: OrderType) => {
    dispatch(setOrderType(type));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay bk-overlay" onClick={onClose}>
      <div className="modal-content bk-modal" onClick={e => e.stopPropagation()}>
        <button className="bk-modal-close" onClick={onClose}><X size={24} /></button>
        
        <div className="bk-modal-logo">
          <CafeLogo />
        </div>

        <h2 className="bk-modal-title">SELECT SERVICE</h2>

        <div className="bk-service-grid">
          <div className="bk-service-card" onClick={() => handleSelection('DELIVERY')}>
            <div className="bk-icon-box">
              <Truck size={48} strokeWidth={1} />
            </div>
            <span>Delivery</span>
          </div>

          <div className="bk-service-card" onClick={() => handleSelection('DINE_IN')}>
            <div className="bk-icon-box">
              <UtensilsCrossed size={48} strokeWidth={1} />
            </div>
            <span>Dine-in / Takeaway</span>
          </div>
        </div>
      </div>

      <style>{`
        .bk-overlay {
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .bk-modal {
          background: #F5EBE0; /* Creamy white */
          padding: 2.5rem 1rem 2rem;
          width: 100%;
          max-width: 400px;
          border-radius: 32px;
          border: none;
          position: relative;
          text-align: center;
        }
        .bk-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #FFFFFF;
          color: #502314;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          z-index: 10;
        }
        .bk-modal-logo {
          margin: 0 auto 1.5rem;
          display: flex;
          justify-content: center;
          color: #502314; /* Force dark brown for logo text in modal */
        }
        .bk-modal-title {
          font-family: 'Playfair Display', serif;
          color: #502314; /* Dark brown */
          font-weight: 900;
          font-size: 1.25rem;
          letter-spacing: 1px;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }
        .bk-service-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .bk-service-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 1.5rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 20px rgba(80, 35, 20, 0.08);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .bk-service-card:active {
          transform: scale(0.95);
        }
        .bk-icon-box {
          color: #E2711D; /* Orange */
        }
        .bk-service-card span {
          color: #502314;
          font-weight: 800;
          font-size: 0.8rem;
          line-height: 1.2;
          text-align: center;
        }
        @media (max-width: 360px) {
          .bk-service-grid {
            gap: 0.75rem;
          }
          .bk-service-card {
            padding: 1rem 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
