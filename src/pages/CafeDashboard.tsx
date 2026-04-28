import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchOrdersByCafe, updateOrderStatusApi } from '../lib/dashboardApi';
import { Clock, CheckCircle, ChefHat, Package } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  itemName: string;
  size?: string;
  menuItem: { name: string };
}

interface Order {
  id: string;
  orderNumber?: number;
  status: string;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  createdAt: string;
  orderItems: OrderItem[];
}

const statusConfig: Record<string, { bg: string; color: string; icon: typeof Clock }> = {
  PENDING: { bg: '#FFF0E6', color: '#FF7622', icon: Clock },
  ACCEPTED: { bg: '#dbeafe', color: '#3b82f6', icon: CheckCircle },
  PREPARING: { bg: '#fef3c7', color: '#f59e0b', icon: ChefHat },
  READY: { bg: '#dcfce7', color: '#22C55E', icon: Package },
  COMPLETED: { bg: '#f1f5f9', color: '#64748b', icon: CheckCircle },
};

export default function CafeDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [, setSocket] = useState<Socket | null>(null);
  const [cafeId, setCafeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrders = async (id: string) => {
    try {
      const data = await fetchOrdersByCafe(id);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get cafe ID from API
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/cafe`)
      .then(r => r.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          const id = data.data[0].id;
          setCafeId(id);
          loadOrders(id);

          // Socket connection
          const newSocket = io(API_URL);
          setSocket(newSocket);
          newSocket.on('connect', () => { newSocket.emit('join-cafe-room', id); });
          newSocket.on('new-order', () => { loadOrders(id); });
          return () => { newSocket.disconnect(); };
        }
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusApi(orderId, status);
      if (cafeId) loadOrders(cafeId);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="page animate-fade-in" id="cafe-dashboard">
      <div style={{ padding: '1rem 0 0.75rem' }}>
        <h2>☕ Cafe Dashboard</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--typo-200)' }}>Manage incoming orders</p>
      </div>
      {loading ? (
        <div className="text-center" style={{ padding: '3rem 0', color: 'var(--typo-200)' }}>
          <p style={{ fontSize: '0.85rem' }}>Loading orders...</p>
        </div>
      ) : (
        <div className="stack">
          {orders.map(order => {
            const config = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = config.icon;
            return (
              <div key={order.id} style={{ background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Order #{order.orderNumber || order.id.slice(0, 8)}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--typo-200)' }}>
                      {new Date(order.createdAt).toLocaleTimeString()} • 
                      ₹{order.totalAmount} 
                      {order.subtotal && <span style={{ fontSize: '0.65rem', marginLeft: '0.4rem' }}>(Sub: ₹{order.subtotal})</span>}
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: config.bg, color: config.color, fontSize: '0.7rem', fontWeight: 600 }}>
                    <StatusIcon size={12} /> {order.status}
                  </span>
                </div>
                <div style={{ marginBottom: '0.65rem' }}>
                  {order.orderItems.map(item => (
                    <div key={item.id} style={{ fontSize: '0.8rem', color: 'var(--typo-300)' }}>
                      {item.quantity}× {item.itemName || item.menuItem?.name || 'Unknown'} {item.size ? `(${item.size})` : ''}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {order.status === 'PENDING' && <button className="btn-primary btn-sm btn-full" onClick={() => updateStatus(order.id, 'ACCEPTED')}>Accept Order</button>}
                  {order.status === 'ACCEPTED' && <button className="btn-primary btn-sm btn-full" onClick={() => updateStatus(order.id, 'PREPARING')}>Start Preparing</button>}
                  {order.status === 'PREPARING' && <button className="btn-primary btn-sm btn-full" onClick={() => updateStatus(order.id, 'READY')}>Mark Ready</button>}
                  {order.status === 'READY' && <button className="btn-sm btn-full" style={{ background: '#dcfce7', color: '#22C55E', fontWeight: 600, border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', cursor: 'pointer' }} onClick={() => updateStatus(order.id, 'COMPLETED')}>Complete</button>}
                </div>
              </div>
            );
          })}
          {orders.length === 0 && (
            <div className="text-center" style={{ padding: '3rem 0', color: 'var(--typo-200)' }}>
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>No orders yet</p>
              <p style={{ fontSize: '0.8rem' }}>Orders will appear here when placed</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
