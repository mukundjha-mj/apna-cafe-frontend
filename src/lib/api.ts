import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== CAFE ====================

export const fetchAllCafes = async () => {
  const { data } = await api.get('/cafe');
  return data.data;
};

export const fetchCafeById = async (id: string) => {
  const { data } = await api.get(`/cafe/${id}`);
  return data.data;
};

// ==================== MENU ====================

export const fetchMenuItems = async (cafeId: string) => {
  const { data } = await api.get(`/menu?cafeId=${cafeId}`);
  return data.data;
};

// ==================== ORDERS ====================

export interface CreateOrderPayload {
  userId: string;
  cafeId: string;
  type: 'DINE_IN' | 'PICKUP';
  tableNumber?: string;
  paymentMethod: 'cash' | 'card';
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  totalAmount: number;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
    size?: string;
    customNote?: string;
  }[];
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await api.post('/orders', payload);
  return data.data;
};

export const fetchUserOrders = async (userId: string) => {
  const { data } = await api.get(`/orders/user/${userId}`);
  return data.data;
};

export const fetchOrderById = async (orderId: string) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data } = await api.patch(`/orders/${orderId}/status`, { status });
  return data.data;
};

export default api;
