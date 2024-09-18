'use client';

import { createReduxStore } from '../config/store';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';

interface StoreProviderProps {
  children?: ReactNode;
}

export const StoreProvider = (props: StoreProviderProps) => {
  const store = createReduxStore();
  return <Provider store={store}>{props?.children}</Provider>;
};
