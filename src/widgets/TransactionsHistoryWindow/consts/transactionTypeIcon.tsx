import { SendFillIcon } from '@/shared/assets/icons/SendFillIcon';
import { TransactionType } from '@/entities/Wallet';
import React from 'react';
import { SwapIcon } from '@/shared/assets/icons/SwapIcon';

export const transactionTypeIcon: Record<TransactionType, React.ReactNode | null> = {
  [TransactionType.SWAP]: <SwapIcon width={24} height={24} />,
  [TransactionType.DEPOSIT]: <SendFillIcon width={24} height={24} style={{ rotate: '180deg' }} />,
  [TransactionType.TRANSFER]: <SendFillIcon width={24} height={24} fill="var(--secondaryText)" />,
};
