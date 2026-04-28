import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchOrders } from '../store/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Loader, ArrowRight, ShoppingBag } from 'lucide-react';

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

  const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
    PENDING: { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', label: 'Order Placed' },
    ACCEPTED: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', label: 'Accepted' },
    PREPARING: { bg: 'rgba(186, 117, 23, 0.1)', color: '#BA7517', label: 'Preparing' },
    READY: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', label: 'Ready' },
    COMPLETED: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', label: 'Delivered' },
    REJECTED: { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', label: 'Rejected' },
  };

  return (
    <div className="page animate-fade-in" id="orders-page" style={{ paddingBottom: '2rem' }}>
      <div style={{ padding: '1.5rem 0 1rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Orders</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track and manage your orders</p>
      </div>

      <div className="tabs-container" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', padding: '0.4rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex' }}>
          <button 
            className={`tab-btn ${tab === 'upcoming' ? 'active' : ''}`} 
            onClick={() => setTab('upcoming')}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.85rem', 
              fontWeight: 700,
              background: tab === 'upcoming' ? 'var(--primary)' : 'transparent',
              color: tab === 'upcoming' ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s'
            }}
          >
            Upcoming
          </button>
          <button 
            className={`tab-btn ${tab === 'history' ? 'active' : ''}`} 
            onClick={() => setTab('history')}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.85rem', 
              fontWeight: 700,
              background: tab === 'history' ? 'var(--primary)' : 'transparent',
              color: tab === 'history' ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s'
            }}
          >
            History
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: '4rem 0' }}>
          <Loader size={32} className="spin" style={{ color: 'var(--primary)', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fetching your delicious history...</p>
        </div>
      ) : currentOrders.length === 0 ? (
        <div className="text-center" style={{ padding: '4rem 1.5rem' }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(186, 117, 23, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShoppingBag size={40} style={{ color: 'var(--primary)', opacity: 0.6 }} />
          </div>
          <h4 style={{ marginBottom: '0.5rem' }}>No orders yet</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '240px', margin: '0 auto 1.5rem' }}>
            {tab === 'upcoming' ? "You don't have any active orders right now." : "You haven't ordered anything yet."}
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>Explore Menu</button>
        </div>
      ) : (
        <div className="orders-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {currentOrders.map((order, idx) => {
            const style = statusStyles[order.status] || statusStyles.PENDING;
            const mainItem = order.orderItems[0];
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            const timeStr = new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            return (
              <div 
                key={order.id} 
                className="premium-order-card"
                onClick={() => navigate(`/order/${order.id}`)}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: 'pointer',
                  animation: `slideUp 0.4s ease-out ${idx * 0.1}s both`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <img 
                        src={mainItem?.menuItem?.imageUrl || '/assets/img-placeholder.svg'} 
                        alt="item" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-cream)' }}>
                          #{order.orderNumber || order.id.slice(0, 4).toUpperCase()}
                        </span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{dateStr}, {timeStr}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {order.orderItems.map(oi => oi.itemName).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div style={{ background: style.bg, color: style.color, padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {style.label}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pay:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>₹{order.totalAmount}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700 }}>
                    Track Order <ArrowRight size={16} />
                  </div>
                </div>

                {order.status === 'COMPLETED' && (
                  <button 
                    className="reorder-btn" 
                    onClick={e => { e.stopPropagation(); }}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '3.5rem',
                      background: 'rgba(186, 117, 23, 0.1)',
                      color: 'var(--primary)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <RotateCcw size={12} /> REORDER
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .premium-order-card {
            transition: transform 0.2s, background 0.2s;
        }
        .premium-order-card:active {
          transform: scale(0.98);
          background: rgba(255,255,255,0.02);
        }
        .reorder-btn {
            transition: all 0.2s;
        }
        .reorder-btn:active {
          background: var(--primary) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}
