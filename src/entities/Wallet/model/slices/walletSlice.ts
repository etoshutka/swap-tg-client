import { COOKIES_KEY_SELECTED_NETWORK, COOKIES_KEY_SELECTED_WALLET } from '@/shared/consts/cookies';
import { WalletSliceSchema } from '../types/walletSliceSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Network, Token, Wallet } from '@/entities/Wallet';
import cookie from 'js-cookie';

const initialState: WalletSliceSchema = {
  wallets: [],
  isLoading: false,
  selectedWallet: undefined,
  selectedNetwork: undefined,
  selectedToken: undefined,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallets(state, action: PayloadAction<Wallet[]>) {
      state.wallets = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSelectedWallet(state, action: PayloadAction<Wallet>) {
      state.selectedWallet = action.payload;
      cookie.set(COOKIES_KEY_SELECTED_WALLET, action.payload.id);
    },
    setSelectedNetwork(state, action: PayloadAction<Network>) {
      state.selectedNetwork = action.payload;
      cookie.set(COOKIES_KEY_SELECTED_NETWORK, action.payload);
    },
    setSelectedToken(state, action: PayloadAction<Token>) {
      console.log('walletSlice - Setting selected token:', action.payload);
      state.selectedToken = action.payload;
    },
    clearSelectedToken(state) {
      console.log('walletSlice - Clearing selected token');
      state.selectedToken = undefined;
    },
  },
});

export const { actions: walletActions } = walletSlice;
export const { reducer: walletReducer } = walletSlice;
