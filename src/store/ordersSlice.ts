import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder as apiCreateOrder, fetchUserOrders as apiFetchOrders, fetchOrderById as apiFetchOrder, type CreateOrderPayload } from '../lib/api';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  itemName: string;
  menuItem?: {
    name: string;
    imageUrl?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  cafeId: string;
  status: string;
  type: string;
  tableNumber?: string;
  totalAmount: number;
  orderItems: OrderItem[];
  cafe?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  activeOrder: Order | null;
  loading: boolean;
  placing: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  activeOrder: null,
  loading: false,
  placing: false,
  error: null,
};

// Place a new order
export const placeOrder = createAsyncThunk(
  'orders/place',
  async (payload: CreateOrderPayload) => {
    const order = await apiCreateOrder(payload);
    return order as Order;
  }
);

// Fetch user's orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (userId: string) => {
    const orders = await apiFetchOrders(userId);
    return orders as Order[];
  }
);

// Fetch a single order by ID
export const fetchOrder = createAsyncThunk(
  'orders/fetchOne',
  async (orderId: string) => {
    const order = await apiFetchOrder(orderId);
    return order as Order;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateOrderInList: (state, action) => {
      const updated = action.payload;
      const idx = state.orders.findIndex(o => o.id === updated.id);
      if (idx >= 0) {
        state.orders[idx] = { ...state.orders[idx], ...updated };
      }
      if (state.activeOrder?.id === updated.id) {
        state.activeOrder = { ...state.activeOrder, ...updated };
      }
    },
    clearActiveOrder: (state) => {
      state.activeOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Place order
    builder.addCase(placeOrder.pending, (state) => {
      state.placing = true;
      state.error = null;
    });
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.placing = false;
      state.activeOrder = action.payload;
      state.orders.unshift(action.payload);
    });
    builder.addCase(placeOrder.rejected, (state, action) => {
      state.placing = false;
      state.error = action.error.message || 'Failed to place order';
    });

    // Fetch all orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch orders';
    });

    // Fetch single order
    builder.addCase(fetchOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.activeOrder = action.payload;
    });
    builder.addCase(fetchOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch order';
    });
  },
});

export const { updateOrderInList, clearActiveOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
