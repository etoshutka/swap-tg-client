'use client';

import { globalReducer } from '@/entities/Global';
import { configureStore } from '@reduxjs/toolkit';
import { walletReducer } from '@/entities/Wallet';
import { useDispatch } from 'react-redux';
import { combineReducers } from 'redux';
import { api } from '@/shared/api/api';

export const rootReducer = combineReducers({
  global: globalReducer,
  wallet: walletReducer,
  [api.reducerPath]: api.reducer,
});

export function createReduxStore(initialState?: StateSchema) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });
}

export type StateSchema = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
