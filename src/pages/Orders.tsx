import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchOrders } from '../store/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, RotateCcw, Loader } from 'lucide-react';
import { useState } from 'react';

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrders(user.id));
    }
  }, [dispatch, user?.id]);

  const upcoming = orders.filter(o => !['COMPLETED', 'REJECTED'].includes(o.status));
  const history = orders.filter(o => ['COMPLETED', 'REJECTED'].includes(o.status));
  const currentOrders = tab === 'upcoming' ? upcoming : history;

  const statusColors: Record<string, { bg: string; color: string }> = {
    PENDING: { bg: '#FFF0E6', color: '#FF7622' },
    ACCEPTED: { bg: '#dbeafe', color: '#3b82f6' },
    PREPARING: { bg: '#fef3c7', color: '#f59e0b' },
    READY: { bg: '#dcfce7', color: '#22C55E' },
    COMPLETED: { bg: '#dcfce7', color: '#22C55E' },
    REJECTED: { bg: '#fef2f2', color: '#ef4444' },
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Pending', ACCEPTED: 'Accepted', PREPARING: 'Preparing',
    READY: 'Ready', COMPLETED: 'Delivered', REJECTED: 'Rejected',
  };

  return (
    <div className="page animate-fade-in" id="orders-page">
      <div style={{ padding: '1rem 0 0.75rem' }}><h2>Orders</h2></div>
      <div className="tabs" style={{ marginBottom: '1rem' }}>
        <button className={`tab${tab === 'upcoming' ? ' active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming</button>
        <button className={`tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>History</button>
      </div>
      {loading ? (
        <div className="text-center" style={{ padding: '3rem 0', color: 'var(--typo-200)' }}>
          <Loader size={28} className="spin" color="var(--primary-300)" style={{ margin: '0 auto 0.5rem', display: 'block', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.85rem' }}>Loading orders...</p>
        </div>
      ) : currentOrders.length === 0 ? (
        <div className="text-center" style={{ padding: '3rem 0', color: 'var(--typo-200)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <ClipboardList size={36} color="var(--primary-300)" />
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--typo-400)' }}>No {tab} orders</p>
          <p style={{ fontSize: '0.8rem' }}>{tab === 'upcoming' ? "You don't have any active orders" : 'Your order history will appear here'}</p>
        </div>
      ) : (
        <div className="stack">
          {currentOrders.map(order => {
            const sc = statusColors[order.status] || statusColors.PENDING;
            const itemsText = order.orderItems.map(oi => `${oi.itemName} × ${oi.quantity}`).join(', ');
            const dateStr = new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
            return (
              <div key={order.id} className="order-card" id={`order-${order.id}`} onClick={() => navigate(`/order/${order.id}`)} style={{ cursor: 'pointer' }}>
                <div className="order-card-header">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>#{order.id.slice(0, 8)}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--typo-200)' }}>{dateStr}</div>
                  </div>
                  <span className="order-card-status" style={{ background: sc.bg, color: sc.color }}>{statusLabels[order.status] || order.status}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--typo-300)', marginBottom: '0.5rem' }}>{itemsText}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹{order.totalAmount}</span>
                  {order.status === 'COMPLETED' && (
                    <button className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={e => { e.stopPropagation(); }}>
                      <RotateCcw size={12} /> Reorder
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
