import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  cafeId: string;
  imageUrl?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.size === action.payload.size
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<{ id: string; size?: string }>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && item.size === action.payload.size)
      );
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; size?: string; quantity: number }>) => {
      const item = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.id === action.payload.id && i.size === action.payload.size)
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
