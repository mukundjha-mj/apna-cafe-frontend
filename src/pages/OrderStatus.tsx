import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchOrder, updateOrderInList } from '../store/ordersSlice';
import { ArrowLeft, Clock, MapPin, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';

const statusSteps = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
const statusLabels: Record<string, string> = {
  PENDING: 'Order Placed', ACCEPTED: 'Accepted', PREPARING: 'Preparing',
  READY: 'Ready for Pickup', COMPLETED: 'Completed',
};

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const activeOrder = useSelector((state: RootState) => state.orders.activeOrder);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const cafeName = useSelector((state: RootState) => state.menu.cafeName);

  const status = activeOrder?.status || 'PENDING';
  const currentIdx = statusSteps.indexOf(status);

  // Fetch order details
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [dispatch, orderId]);

  // Listen for real-time updates via Socket.IO
  useEffect(() => {
    if (!orderId) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(API_URL);
    socket.on('connect', () => {
      socket.emit('join-order-room', orderId);
    });
    socket.on('order-update', (updatedOrder: any) => {
      dispatch(updateOrderInList(updatedOrder));
      // Also refetch to get full data
      dispatch(fetchOrder(orderId));
    });
    return () => { socket.disconnect(); };
  }, [orderId, dispatch]);

  return (
    <div className="page animate-fade-in" id="order-status-page">
      <div style={{ padding: '1rem 0 0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="page-header-icon" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={20} /></button>
          <h2 style={{ margin: 0 }}>Track Order</h2>
        </div>
      </div>
      <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--typo-200)', marginBottom: '0.25rem' }}>Order ID</div>
        <div style={{ fontWeight: 700, fontSize: '1rem' }}>#{(orderId || '').slice(0, 8)}</div>
      </div>
      {loading && !activeOrder ? (
        <div className="text-center" style={{ padding: '2rem 0', color: 'var(--typo-200)' }}>
          <p>Loading order...</p>
        </div>
      ) : (
        <>
          <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
            {statusSteps.map((step, idx) => (
              <div key={step} style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                {idx < statusSteps.length - 1 && (
                  <div style={{ position: 'absolute', left: 13, top: 28, width: 2, height: 'calc(100% - 4px)', background: idx < currentIdx ? 'var(--primary-300)' : 'var(--bg-200)' }} />
                )}
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: idx <= currentIdx ? 'var(--primary-300)' : 'var(--bg-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  {idx < currentIdx ? <CheckCircle size={16} color="#fff" /> : idx === currentIdx ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <div style={{ paddingBottom: idx < statusSteps.length - 1 ? '1.5rem' : 0, flex: 1 }}>
                  <div style={{ fontWeight: idx === currentIdx ? 700 : 500, fontSize: '0.85rem', color: idx <= currentIdx ? 'var(--typo-500)' : 'var(--typo-100)' }}>{statusLabels[step]}</div>
                  {idx === currentIdx && <div style={{ fontSize: '0.72rem', color: 'var(--primary-300)', marginTop: '0.15rem' }}>In progress...</div>}
                </div>
              </div>
            ))}
          </div>
          {activeOrder && (
            <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Order Items</h4>
              {activeOrder.orderItems.map(oi => (
                <div key={oi.id} style={{ fontSize: '0.8rem', color: 'var(--typo-300)', marginBottom: '0.25rem' }}>
                  {oi.quantity}× {oi.itemName} — ₹{oi.price * oi.quantity}
                </div>
              ))}
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.5rem', borderTop: '1px solid var(--bg-200)', paddingTop: '0.5rem' }}>
                Total: ₹{activeOrder.totalAmount}
              </div>
            </div>
          )}
          <div style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><Clock size={16} color="var(--typo-200)" /><span style={{ color: 'var(--typo-200)' }}>Estimated time</span></div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>20mins</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><MapPin size={16} color="var(--typo-200)" /><span style={{ color: 'var(--typo-200)' }}>Pickup from</span></div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cafeName || 'Cafe'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
