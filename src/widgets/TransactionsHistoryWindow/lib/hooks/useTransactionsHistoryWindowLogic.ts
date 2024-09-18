import { getSelectedWallet, Wallet, walletApi } from '@/entities/Wallet';
import { getIsWindowOpen, GlobalWindow } from '@/entities/Global';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export const useTransactionsHistoryWindowLogic = () => {
  const { errorToast } = useToasts();

  const isWindowOpen: boolean = useSelector(getIsWindowOpen)(GlobalWindow.TransactionsHistory);
  const selectedWallet: Wallet | undefined = useSelector(getSelectedWallet);

  const { data, isLoading, isError } = walletApi.useGetWalletTransactionsQuery(
    { id: `${selectedWallet?.id}` },
    { skip: !selectedWallet || !isWindowOpen }
  );

  useEffect(() => {
    isError && errorToast('Failed to get transactions history');
  }, [isError]);

  return {
    flow: {},
    state: {
      isLoading,
      isWindowOpen,
      transactions: data?.data ?? [],
    },
  };
};
