import { GlobalSliceSchema, GlobalWindow, GlobalWindowType } from '../types/globalSliceSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: GlobalSliceSchema = {
  isLoading: false,
  windowsOpen: [],
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addWindow: (state, action: PayloadAction<GlobalWindowType<GlobalWindow>>) => {
      if (state.windowsOpen.some((item) => item.window === action.payload.window)) {
        return;
      } else {
        state.windowsOpen = [...state.windowsOpen, action.payload];
      }
    },
    removeWindow: (state, action: PayloadAction<GlobalWindow>) => {
      state.windowsOpen = state.windowsOpen.filter((item) => item.window !== action.payload);
    },
    removeAllWindows: (state) => {
      state.windowsOpen = [];
    },
    removeLastWindow: (state) => {
      state.windowsOpen.pop();
    },
  },
});

export const { reducer: globalReducer } = globalSlice;
export const { actions: globalActions } = globalSlice;
