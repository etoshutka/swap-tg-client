import { StateSchema } from '@/shared/lib/providers/StoreProvider';

export const getWallets = (state: StateSchema) => state.wallet.wallets;

export const getIsLoading = (state: StateSchema) => state.wallet.isLoading;

export const getSelectedWallet = (state: StateSchema) => state.wallet.selectedWallet;

export const getSelectedNetwork = (state: StateSchema) => state.wallet.selectedNetwork;

export const getSelectedToken = (state: StateSchema) => state.wallet.selectedToken;
