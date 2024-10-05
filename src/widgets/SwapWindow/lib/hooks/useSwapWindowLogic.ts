import { getSelectedWallet, Network, Token, Wallet, walletApi } from '@/entities/Wallet';
import { getIsWindowOpen, globalActions, GlobalWindow } from '@/entities/Global';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useMemo, useCallback } from 'react';

export const useSwapWindowLogic = () => {
  const { errorToast, successToast } = useToasts();
  const dispatch = useDispatch();

  const [fromToken, setFromToken] = useState<Token | undefined>();
  const [toToken, setToToken] = useState<Token | undefined>();
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(0);
  const [currentView, setCurrentView] = useState<'swap' | 'selectFromToken' | 'selectToToken'>('swap');
  const [tokenExtendedInfo, setTokenExtendedInfo] = useState<any>(null);
  const [isTokenInfoLoading, setIsTokenInfoLoading] = useState<boolean>(false);
  const [getHistoricalQuotesRequest] = walletApi.useLazyGetHistoricalQuotesQuery();
  const [historicalData, setHistoricalData] = useState<{ timestamp: string; price: number }[]>([]);

 //const [estimatedGas, setEstimatedGas] = useState<number | null>(null);
  
  //const [estimateGas, { isLoading: isEstimatingGas }] = walletApi.useEstimateGasMutation();
  const [getTokenPriceRequest] = walletApi.useLazyGetTokenPriceQuery();
  const [swapRequest, { isLoading: isSwapLoading }] = walletApi.useSwapMutation();
  const [getWalletsRequest] = walletApi.useLazyGetWalletsQuery();
  const [getTokenExtendedInfoRequest] = walletApi.useLazyGetTokenExtendedInfoQuery();

  const selectedWallet: Wallet | undefined = useSelector(getSelectedWallet);
  const isSwapWindowOpen: boolean = useSelector(getIsWindowOpen)(GlobalWindow.Swap);
  const isConfirmSwapWindowOpen: boolean = useSelector(getIsWindowOpen)(GlobalWindow.ConfirmSwap);

  const fromTokens = useMemo(() => 
    selectedWallet?.tokens ? selectedWallet.tokens.filter((t) => t.balance > 0) : [],
    [selectedWallet]
  );

  const toTokens = useMemo(() => 
    selectedWallet?.tokens ? selectedWallet.tokens : [],
    [selectedWallet]
  );

  // const handleEstimateGas = useDebounce(async () => {
  //   try {
  //     if (!fromToken || !toToken || !selectedWallet || !fromAmount) return;

  //     const result = await estimateGas({
  //       wallet_id: selectedWallet.id,
  //       from_token_id: fromToken.id,
  //       to_token_id: toToken.id,
  //       amount: Number(fromAmount),
  //     }).unwrap();

  //     if (result.ok && result.data !== undefined) {
  //       setEstimatedGas(result.data);
  //     }
  //   } catch (e) {
  //     errorToast('Failed to estimate gas fee');
  //   }
  // }, 350);

  // useEffect(() => {
  //   if (fromToken && toToken && fromAmount && selectedWallet) {
  //     handleEstimateGas();
  //   }
  // }, [fromToken, toToken, fromAmount, selectedWallet]);

  const handleGetHistoricalQuotes = useDebounce(async (token: Token) => {
    try {
      setIsLoading(true);
      const result = await getHistoricalQuotesRequest({
        id: token.id,
        symbol: token.symbol,
        address: token.contract,
        timeStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        timeEnd: new Date().toISOString(),
        interval: '1d',
        convert: 'USD',
      }).unwrap();

      console.log('Historical quotes result:', result);

      if (result.ok && result.data && Array.isArray(result.data.quotes)) {
        setHistoricalData(result.data.quotes);
      } else {
        console.log('No historical data available or invalid response structure');
        setHistoricalData([]);
      }
    } catch (e) {
      console.error('Error in getHistoricalQuotes:', e);
      errorToast('Failed to get historical quotes');
      setHistoricalData([]);
    } finally {
      setIsLoading(false);
    }
  }, 350);

  useEffect(() => {
    if (toToken) {
      handleGetHistoricalQuotes(toToken);
    }
  }, [toToken]);

  const handleGetRate = useDebounce(async (amount: string) => {
    try {
      setIsLoading(true);
      if (!fromToken || !toToken || !selectedWallet || !amount || Number(amount) > fromToken?.balance) return;
  
      const result = await getTokenPriceRequest({
        symbol: fromToken?.symbol,
        network: selectedWallet?.network,
      }).unwrap();
  
      if (result.ok && result.data) {
        const fromTokenPrice = result.data.price;
        
        const toTokenResult = await getTokenPriceRequest({
          symbol: toToken?.symbol,
          network: selectedWallet?.network,
        }).unwrap();
  
        if (toTokenResult.ok && toTokenResult.data) {
          const toTokenPrice = toTokenResult.data.price;
          
          const conversionRate = fromTokenPrice / toTokenPrice;
          const convertedAmount = Number(amount) * conversionRate;
          
          setRate(conversionRate);
          setToAmount(convertedAmount.toFixed(6));
        }
      }
    } catch (e) {
      errorToast('Failed to get token price');
    } finally {
      setIsLoading(false);
    }
  }, 350);

  const handleGetTokenExtendedInfo = useDebounce(async (token: Token, network: Network) => {
    try {
      console.log('Token:', token);
      console.log('Query params:', { network: token.network, contract: token.contract });
      setIsTokenInfoLoading(true);
      const result = await getTokenExtendedInfoRequest({
        symbol: token.symbol,  // Добавьте это
        contract: token.contract,  // Измените contract на address
        network: token.network
      }).unwrap();

      if (result.ok && result.data) {
        setTokenExtendedInfo(result.data);
      }
    } catch (e) {
      errorToast('Failed to get extended token info');
    } finally {
      setIsTokenInfoLoading(false);
    }
  }, 350);

  const handleClearState = () => {
    setFromToken(undefined);
    setToToken(undefined);
    setFromAmount('');
    setToAmount('');
    setRate(0);
    setCurrentView('swap');
    setTokenExtendedInfo(null);
  };

  const handleSwapConfirm = async () => {
    try {
      setIsLoading(true)
      if (!fromToken || !toToken || !selectedWallet || !fromAmount) return;

      const result = await swapRequest({
        wallet_id: selectedWallet.id,
        from_token_id: fromToken.id,
        to_token_id: toToken.id,
        amount: Number(fromAmount),
      }).unwrap();

      if (result.ok) {
        successToast('Swap successful');
        handleClearState();
        dispatch(globalActions.removeAllWindows());
        getWalletsRequest(); // Обновляем данные кошелька после успешного свапа
      }
    } catch (e) {
      errorToast('Failed to swap tokens');
    } finally {
      setIsLoading(false)
    }
  };

  const handleFromAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setFromAmount(newAmount);

    if (fromToken && Number(newAmount) > fromToken.balance) {
      errorToast('Insufficient funds');
    }

    if (newAmount) {
      handleGetRate(newAmount);
    } else {
      setRate(0);
      setToAmount('');
    }
  }, [fromToken, errorToast, handleGetRate]);


  const handleMaxButtonClick = () => {
    if (fromToken) {
      setFromAmount(fromToken.balance.toString());
      handleGetRate(fromToken.balance.toString());
    }
  };

  const handleOpenConfirmWindow = () => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.ConfirmSwap }));
  };

  const handleOpenSelectFromTokenModal = () => {
    setCurrentView('selectFromToken');
  };

  const handleOpenSelectToTokenModal = () => {
    setCurrentView('selectToToken');
  };

  const handleSelectFromToken = (token: Token) => {
    setFromToken(token);
    setCurrentView('swap');
    if (token.id === toToken?.id) {
      setToToken(undefined);
      setTokenExtendedInfo(null);
    }
    if (fromAmount) {
      handleGetRate(fromAmount);
    }
  };

  const handleSelectToToken = (token: Token) => {
    setToToken(token);
    setCurrentView('swap');
    if (token.id === fromToken?.id) {
      setFromToken(undefined);
    }
    if (selectedWallet?.network) {
      handleGetTokenExtendedInfo(token, selectedWallet.network);
    }
    if (fromAmount) {
      handleGetRate(fromAmount);
    }
  };

  const handleBackToSwap = () => {
    setCurrentView('swap');
  };

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    if (fromToken && selectedWallet?.network) {
      handleGetTokenExtendedInfo(fromToken, selectedWallet.network);
    }
  };

  return {
    flow: {
      handleFromAmountChange,
      handleSwapConfirm,
      handleMaxButtonClick,
      handleOpenConfirmWindow,
      handleOpenSelectFromTokenModal,
      handleOpenSelectToTokenModal,
      handleSelectFromToken,
      handleSelectToToken,
      handleBackToSwap,
      handleSwapTokens,
    },
    state: {
      fromAmount,
      toAmount,
      rate,
      fromToken,
      toToken,
      isConfirmSwapWindowOpen,
      isLoading: isLoading || isSwapLoading,
      isSwapWindowOpen,
      selectedWallet,
      fromTokens,
      toTokens,
      network: selectedWallet?.network,
      isSwapButtonDisabled: !fromToken || !toToken || !fromAmount || isLoading || (fromToken && Number(fromAmount) > fromToken.balance),
      isNoTokensToSwap: fromTokens.length === 0,
      currentView,
      tokenExtendedInfo,
      isTokenInfoLoading,
      historicalData,
      //estimatedGas
    },
  };
};

export type UseSwapWindowLogic = ReturnType<typeof useSwapWindowLogic>;