const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchOrdersByCafe = async (cafeId: string) => {
  const res = await fetch(`${API_URL}/api/orders/cafe/${cafeId}`);
  const data = await res.json();
  return data.data;
};

export const updateOrderStatusApi = async (orderId: string, status: string) => {
  const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  return data.data;
};
