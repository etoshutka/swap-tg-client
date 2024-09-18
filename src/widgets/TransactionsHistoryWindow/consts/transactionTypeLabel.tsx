import { TransactionType } from '@/entities/Wallet';
import React from 'react';

export const transactionTypeLabel: Record<TransactionType, React.ReactNode | null> = {
  [TransactionType.SWAP]: 'Swap',
  [TransactionType.DEPOSIT]: 'Deposit',
  [TransactionType.TRANSFER]: 'Transfer',
};
