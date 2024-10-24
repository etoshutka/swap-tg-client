import { getSelectedWallet, Wallet, walletApi } from '@/entities/Wallet';
import { getIsWindowOpen, GlobalWindow } from '@/entities/Global';
import { useSelector } from 'react-redux';
import { StateSchema } from '@/shared/lib/providers/StoreProvider'; 

export const useTokenTransactionsWindowLogic = () => {
  const isWindowOpen: boolean = useSelector(getIsWindowOpen)(GlobalWindow.TokenDetails);
  const selectedWallet: Wallet | undefined = useSelector(getSelectedWallet);
  const selectedToken = useSelector((state: StateSchema) => state.wallet.selectedToken);

  const { data, isLoading, isError } = walletApi.useGetTokenTransactionsQuery(
    { wallet_id: selectedWallet?.id ?? '', token_symbol: selectedToken?.symbol ?? '' },
    { skip: !selectedWallet || !isWindowOpen || !selectedToken }
  );


  return {
    flow: {},
    state: {
      isLoading,
      isWindowOpen,
      transactions: data?.data?.transactions ?? [],
      groupedTransactions: data?.data?.groupedTransactions ?? {},
      selectedToken,
    },
  };
};