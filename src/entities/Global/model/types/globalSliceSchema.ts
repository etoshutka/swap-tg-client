export enum GlobalWindow {
  Deposit = 'Deposit',
  Swap = 'Swap',
  Transfer = 'Transfer',
  Referral = 'Referral',
  AddWallet = 'AddWallet',
  Networks = 'Networks',
  WalletsList = 'WalletsList',
  AddToken = 'AddToken',
  TransactionsHistory = 'TransactionsHistory',
  WalletDetails = 'WalletDetails',
  TransactionDetails = 'TransactionDetails',
  ImportWallet = 'ImportWallet',
  CreateWallet = 'CreateWallet',
  PrepareTransfer = 'PrepareTransfer',
  ConfirmTransfer = 'ConfirmTransfer',
}

export interface GlobalWindowType<T> {
  window: T;
  payload?: Record<string, any>;
}

export interface GlobalSliceSchema {
  isLoading: boolean;
  windowsOpen: GlobalWindowType<GlobalWindow>[];
}
