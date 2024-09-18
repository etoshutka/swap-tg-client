import { Network } from '@/entities/Wallet';

export interface DeleteWalletParams {
  id: string;
}

export interface CreateWalletParams {
  network: Network;
  name: string;
}

export interface ImportWalletParams {
  network: Network;
  name: string;
  private_key: string;
}

export interface GetTokenInfoParams {
  network: Network;
  contract: string;
}

export interface GetTokenInfoResult {
  symbol: string;
  network: Network;
  name: string;
  contract: string;
  price: number;
  price_change_percentage: number;
  icon: string;
}

export interface GetTokenPriceParams {
  network: Network;
  symbol?: string;
  contract?: string;
}

export interface GetTokenPriceResult {
  price: number;
  price_change_percentage: number;
}

export interface AddWalletTokenParams {
  wallet_id: string;
  wallet_address: string;
  network: Network;
  contract: string;
}

export interface TransferParams {
  amount: number;
  currency: string;
  token_id: string;
  wallet_id: string;
  to_address: string;
}

export interface GetWalletTransactionsParams {
  id: string;
}
