import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  itemIds: string[];
}

const initialState: FavoritesState = {
  itemIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.itemIds.indexOf(action.payload);
      if (index >= 0) {
        state.itemIds.splice(index, 1);
      } else {
        state.itemIds.push(action.payload);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
