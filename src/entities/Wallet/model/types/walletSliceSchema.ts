import { Network, Token, Wallet } from './walletSchema';

export interface WalletSliceSchema {
  wallets: Wallet[];
  isLoading: boolean;
  selectedWallet: Wallet | undefined;
  selectedNetwork: Network | undefined;
  selectedToken: Token | undefined;
}
