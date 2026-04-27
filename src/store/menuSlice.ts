import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { fetchAllCafes, fetchMenuItems } from '../lib/api';

// Image mapping: DB stores keys like "pizza", frontend maps to local assets
import pizzaImg from '../assets/food/pizza.png';
import burgerImg from '../assets/food/burger.png';
import friesImg from '../assets/food/fries.png';
import momosImg from '../assets/food/momos.png';
import shakesImg from '../assets/food/shakes.png';
import comboImg from '../assets/food/combo.png';

const imageMap: Record<string, string> = {
  pizza: pizzaImg,
  burger: burgerImg,
  fries: friesImg,
  momos: momosImg,
  shakes: shakesImg,
  combo: comboImg,
};

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
  image: string;        // resolved local image path
  imageUrl: string;     // raw key from DB
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

// Resolve image key to local asset path
function resolveImage(imageUrl: string | null): string {
  if (!imageUrl) return pizzaImg;
  return imageMap[imageUrl] || pizzaImg;
}

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
    image: resolveImage(item.imageUrl),
    imageUrl: item.imageUrl || '',
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

// Selectors
export const selectAllMenuItems = (state: { menu: MenuState }) =>
  state.menu.items.filter(i => !i.isCombo);

export const selectComboItems = (state: { menu: MenuState }) =>
  state.menu.items.filter(i => i.isCombo);

export const selectBestsellers = (state: { menu: MenuState }) =>
  state.menu.items.filter(i => i.isBestseller && !i.isCombo);

export const selectNewItems = (state: { menu: MenuState }) =>
  state.menu.items.filter(i => i.isNew && !i.isCombo);

export const selectByCategory = (category: string) => (state: { menu: MenuState }) => {
  if (category === 'all') return state.menu.items.filter(i => !i.isCombo);
  if (category === 'combos') return state.menu.items.filter(i => i.isCombo);
  return state.menu.items.filter(i => i.category === category && !i.isCombo);
};

export const selectCategories = (state: { menu: MenuState }) => {
  const cats = new Set(state.menu.items.filter(i => !i.isCombo).map(i => i.category));
  return ['all', ...Array.from(cats), 'combos'];
};

export const { setOrderType, toggleOrderType } = menuSlice.actions;

export default menuSlice.reducer;
