import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchOrder, updateOrderInList } from '../store/ordersSlice';
import { ArrowLeft, Clock, MapPin, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import { API_URL } from '../lib/api';

const statusSteps = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const activeOrder = useSelector((state: RootState) => state.orders.activeOrder);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const { cafeName } = useSelector((state: RootState) => state.menu);

  const status = activeOrder?.status || 'PENDING';
  const orderType = activeOrder?.type || 'PICKUP';
  const currentIdx = statusSteps.indexOf(status);

  const statusLabels: Record<string, string> = {
    PENDING: 'Order Placed',
    ACCEPTED: 'Accepted',
    PREPARING: 'Preparing',
    READY: orderType === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup',
    COMPLETED: 'Completed',
  };

  // Fetch order details
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [dispatch, orderId]);

  // Listen for real-time updates via Socket.IO
  useEffect(() => {
    if (!orderId) return;
    const socket = io(API_URL);
    socket.on('connect', () => {
      socket.emit('join-order-room', orderId);
    });
    socket.on('order-updated', (updatedOrder: any) => {
      dispatch(updateOrderInList(updatedOrder));
    });
    return () => { socket.disconnect(); };
  }, [orderId, dispatch]);

  return (
    <div className="page animate-fade-in" id="order-status-page">
      <div className="status-header">
        <button className="page-header-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2>Track Order</h2>
      </div>

      {loading && !activeOrder ? (
        <div className="status-loading">
          <div className="loader" />
          <p>Fetching your order status...</p>
        </div>
      ) : (
        <div className="status-content">
          <div className="order-id-card">
            <span className="label">Order ID</span>
            <span className="value">#{activeOrder?.orderNumber || (orderId || '').slice(0, 8).toUpperCase()}</span>
          </div>

          <div className="steps-card">
            {statusSteps.map((step, idx) => (
              <div key={step} className={`status-step ${idx <= currentIdx ? 'active' : ''} ${idx === currentIdx ? 'current' : ''}`}>
                <div className="step-indicator">
                  {idx < currentIdx ? <CheckCircle size={18} /> : <div className="dot" />}
                  {idx < statusSteps.length - 1 && <div className="step-line" />}
                </div>
                <div className="step-info">
                  <span className="step-label">{statusLabels[step]}</span>
                  {idx === currentIdx && <span className="step-subtext">In progress...</span>}
                </div>
              </div>
            ))}
          </div>

          {activeOrder && (
            <div className="order-details-card">
              <div className="details-header">
                <h4>Order Summary</h4>
                <span className="order-type-label">{activeOrder.type}</span>
              </div>
              <div className="items-list">
                {activeOrder.orderItems.map(oi => (
                  <div key={oi.id} className="item-row">
                    <span>{oi.quantity}× {oi.itemName}</span>
                    <span>₹{oi.price * oi.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="total-row">
                <span>Total Amount</span>
                <span>₹{activeOrder.totalAmount}</span>
              </div>
            </div>
          )}

          <div className="status-footer-card">
            <div className="footer-row">
              <div className="icon-wrap"><Clock size={18} /></div>
              <div className="text-wrap">
                <span className="label">Estimated time</span>
                <span className="value">15-20 mins</span>
              </div>
            </div>
            <div className="footer-row">
              <div className="icon-wrap"><MapPin size={18} /></div>
              <div className="text-wrap">
                <span className="label">{activeOrder?.type === 'DELIVERY' ? 'Deliver to' : 'Pickup from'}</span>
                <span className="value">{activeOrder?.type === 'DELIVERY' ? activeOrder.address : (cafeName || 'Cafe')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #order-status-page {
          background: var(--bg-dark);
          min-height: 100vh;
        }
        .status-header {
          padding: 1.5rem 1.25rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .status-content {
          padding: 0 1.25rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .order-id-card {
          background: var(--bg-card);
          padding: 1rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .order-id-card .label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.25rem;
        }
        .order-id-card .value {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary);
        }
        .steps-card {
          background: var(--bg-card);
          padding: 2rem 1.5rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .status-step {
          display: flex;
          gap: 1.25rem;
          height: 70px;
        }
        .status-step:last-child {
          height: auto;
        }
        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .step-indicator .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          z-index: 2;
        }
        .status-step.active .dot {
          background: var(--primary);
          border-color: var(--primary-glow);
          box-shadow: 0 0 12px var(--primary-glow);
        }
        .status-step.active svg {
          color: var(--primary);
          z-index: 2;
        }
        .step-line {
          position: absolute;
          top: 18px;
          bottom: -4px;
          width: 2px;
          background: rgba(255, 255, 255, 0.05);
          z-index: 1;
        }
        .status-step.active .step-line {
          background: var(--primary-glow);
        }
        .step-info {
          display: flex;
          flex-direction: column;
          padding-top: 0.15rem;
        }
        .step-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .status-step.active .step-label {
          color: var(--text-cream);
        }
        .status-step.current .step-label {
          color: var(--primary);
          font-weight: 700;
        }
        .step-subtext {
          font-size: 0.7rem;
          color: var(--primary);
          font-weight: 500;
        }
        .order-details-card {
          background: var(--bg-card);
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .order-type-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--primary);
          background: var(--primary-glow);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding-top: 1rem;
          font-weight: 700;
          color: var(--text-cream);
        }
        .status-footer-card {
          background: var(--bg-card);
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer-row {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .icon-wrap {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          color: var(--primary);
        }
        .text-wrap {
          display: flex;
          flex-direction: column;
        }
        .text-wrap .label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .text-wrap .value {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .status-loading {
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
