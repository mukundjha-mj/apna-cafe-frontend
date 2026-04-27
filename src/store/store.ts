import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import favoritesReducer from './favoritesSlice';
import authReducer from './authSlice';
import menuReducer from './menuSlice';
import ordersReducer from './ordersSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    menu: menuReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
