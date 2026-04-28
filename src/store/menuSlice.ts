import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { fetchAllCafes, fetchMenuItems } from '../lib/api';

export interface MenuItemSize {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  cafeId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sizes?: MenuItemSize[] | null;
  imageUrl: string;
  isVeg: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isCombo: boolean;
  comboContents?: string | null;
  isAvailable: boolean;
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

interface MenuState {
  items: MenuItem[];
  cafeId: string | null;
  cafeName: string | null;
  orderType: OrderType | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  cafeId: null,
  cafeName: null,
  orderType: localStorage.getItem('orderType') as OrderType | null,
  loading: false,
  error: null,
};

// Fetch menu: first get the cafe, then its menu items
export const fetchMenu = createAsyncThunk('menu/fetchMenu', async () => {
  // Get the first cafe (single-cafe app)
  const cafes = await fetchAllCafes();
  if (!cafes || cafes.length === 0) {
    throw new Error('No cafe found');
  }
  const cafe = cafes[0];

  // Fetch menu items for this cafe
  const rawItems = await fetchMenuItems(cafe.id);

  // Map DB items to frontend shape
  const items: MenuItem[] = rawItems.map((item: any) => ({
    id: item.id,
    cafeId: item.cafeId,
    name: item.name,
    description: item.description || '',
    category: item.category,
    price: item.price,
    sizes: item.sizes || null,
    imageUrl: item.imageUrl || '/assets/img-placeholder.svg',
    isVeg: item.isVeg,
    isNew: item.isNew || false,
    isBestseller: item.isBestseller || false,
    isCombo: item.isCombo || false,
    comboContents: item.comboContents || null,
    isAvailable: item.isAvailable,
  }));

  return { items, cafeId: cafe.id, cafeName: cafe.name };
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setOrderType: (state, action: PayloadAction<OrderType>) => {
      state.orderType = action.payload;
      localStorage.setItem('orderType', action.payload);
    },
    toggleOrderType: (state) => {
      const next = state.orderType === 'DELIVERY' ? 'DINE_IN' : 'DELIVERY';
      state.orderType = next;
      localStorage.setItem('orderType', next);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMenu.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMenu.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.cafeId = action.payload.cafeId;
      state.cafeName = action.payload.cafeName;
    });
    builder.addCase(fetchMenu.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch menu';
    });
  },
});

import { createSelector } from '@reduxjs/toolkit';

// Base selector
const selectMenu = (state: { menu: MenuState }) => state.menu;

export const selectAllMenuItems = createSelector(
  [selectMenu],
  (menu) => menu.items.filter(i => !i.isCombo)
);

export const selectComboItems = createSelector(
  [selectMenu],
  (menu) => menu.items.filter(i => i.isCombo)
);

export const selectBestsellers = createSelector(
  [selectMenu],
  (menu) => menu.items.filter(i => i.isBestseller && !i.isCombo)
);

export const selectNewItems = createSelector(
  [selectMenu],
  (menu) => menu.items.filter(i => i.isNew && !i.isCombo)
);

export const selectByCategory = (category: string) => createSelector(
  [selectMenu],
  (menu) => {
    if (category === 'all') return menu.items.filter(i => !i.isCombo);
    if (category === 'combos') return menu.items.filter(i => i.isCombo);
    return menu.items.filter(i => i.category === category && !i.isCombo);
  }
);

export const selectCategories = createSelector(
  [selectMenu],
  (menu) => {
    const cats = new Set(menu.items.filter(i => !i.isCombo).map(i => i.category));
    return ['all', ...Array.from(cats), 'combos'];
  }
);

export const { setOrderType, toggleOrderType } = menuSlice.actions;

export default menuSlice.reducer;
