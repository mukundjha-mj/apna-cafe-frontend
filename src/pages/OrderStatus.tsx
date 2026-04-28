import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchOrder, updateOrderInList, clearActiveOrder } from '../store/ordersSlice';
import { ArrowLeft, Clock, MapPin, CheckCircle, Package, Utensils, Bike, CheckCircle2, ShoppingBag } from 'lucide-react';
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

  const isCorrectOrder = activeOrder?.id === orderId;
  const status = activeOrder?.status || 'PENDING';
  const orderType = activeOrder?.type || 'PICKUP';
  const currentIdx = statusSteps.indexOf(status);

  const statusConfig: Record<string, { label: string; icon: any }> = {
    PENDING: { label: 'Order Received', icon: Package },
    ACCEPTED: { label: 'Chef Accepted', icon: CheckCircle2 },
    PREPARING: { label: 'In the Kitchen', icon: Utensils },
    READY: { label: orderType === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup', icon: orderType === 'DELIVERY' ? Bike : ShoppingBag },
    COMPLETED: { label: 'Enjoy your Meal!', icon: CheckCircle },
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Order Placed',
    ACCEPTED: 'Accepted',
    PREPARING: 'Preparing',
    READY: orderType === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup',
    COMPLETED: 'Completed',
  };

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (!orderId) return;
    const socket = io(API_URL);
    socket.on('connect', () => {
      socket.emit('join-order-room', orderId);
    });
    socket.on('order-updated', (updatedOrder: any) => {
      dispatch(updateOrderInList(updatedOrder));
    });
    return () => { 
      socket.disconnect(); 
      dispatch(clearActiveOrder());
    };
  }, [orderId, dispatch]);

  return (
    <div className="page animate-fade-in" id="order-status-page">
      <div className="status-header">
        <button className="page-header-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2>Track Order</h2>
      </div>

      {(!isCorrectOrder || (loading && !activeOrder)) ? (
        <div className="status-loading" style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
          <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid rgba(186, 117, 23, 0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Locating your order...</p>
        </div>
      ) : (
        <div className="status-content">
          {/* Main Status Header */}
          <div className="main-status-card" style={{ background: 'var(--bg-card)', padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '0.5rem' }}>Current Status</div>
            <h1 style={{ color: 'var(--primary)', fontSize: '1.6rem', marginBottom: '1rem' }}>{statusLabels[status]}</h1>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order #{activeOrder?.orderNumber || (orderId || '').slice(0, 8).toUpperCase()}</div>
          </div>

          {/* Timeline */}
          <div className="timeline-card" style={{ background: 'var(--bg-card)', padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {statusSteps.map((step, idx) => {
              const Icon = statusConfig[step].icon;
              const isActive = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              
              return (
                <div key={step} className={`timeline-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`} style={{ display: 'flex', gap: '1.5rem', position: 'relative', paddingBottom: idx === statusSteps.length - 1 ? 0 : '2.5rem' }}>
                  {idx < statusSteps.length - 1 && (
                    <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '0', width: '2px', background: isActive && idx < currentIdx ? 'var(--primary)' : 'rgba(255,255,255,0.05)', zIndex: 1 }} />
                  )}
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isCurrent ? 'var(--primary)' : (isActive ? 'var(--primary-glow)' : 'rgba(255,255,255,0.03)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? (isCurrent ? 'white' : 'var(--primary)') : 'rgba(255,255,255,0.2)', zIndex: 2, transition: 'all 0.3s' }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ paddingTop: '0.5rem' }}>
                    <div style={{ fontWeight: isActive ? 700 : 500, color: isActive ? (isCurrent ? 'var(--primary)' : 'var(--text-cream)') : 'var(--text-muted)', fontSize: '0.95rem' }}>{statusConfig[step].label}</div>
                    {isCurrent && <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.2rem' }}>We're on it!</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details */}
          <div className="details-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>Order Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeOrder?.orderItems.map(oi => (
                  <div key={oi.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{oi.quantity}× {oi.itemName}</span>
                    <span style={{ fontWeight: 600 }}>₹{oi.price * oi.quantity}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.1)', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                  <span>Total Amount</span>
                  <span>₹{activeOrder?.totalAmount}</span>
                </div>
            </div>
          </div>

          <div className="footer-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={20} style={{ color: 'var(--primary)' }} />
                <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>EST. TIME</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>15-20 Mins</div>
                </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={20} style={{ color: 'var(--primary)' }} />
                <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{activeOrder?.type === 'DELIVERY' ? 'DELIVERY' : 'PICKUP'}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>{activeOrder?.type === 'DELIVERY' ? activeOrder.address : (cafeName || 'Cafe')}</div>
                </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #order-status-page { background: var(--bg-dark); min-height: 100vh; }
        .status-header { padding: 1.5rem 1.25rem 1rem; display: flex; align-items: center; gap: 1rem; }
        .status-content { padding: 0 1.25rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
