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

  const [getTokenPriceRequest] = walletApi.useLazyGetTokenPriceQuery();
  const [swapRequest, { isLoading: isSwapLoading }] = walletApi.useSwapMutation();
  const [getWalletsRequest] = walletApi.useLazyGetWalletsQuery();

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

  // const handleGetRate = useDebounce(async (amount: string) => {
  //   try {
  //     setIsLoading(true);
  //     if (!fromToken || !toToken || !selectedWallet || !amount || Number(amount) > fromToken?.balance) return;
  
  //     const result = await getTokenPriceRequest({
  //       symbol: fromToken?.symbol,
  //       network: selectedWallet?.network,
  //     }).unwrap();
  
  //     if (result.ok && result.data) {
  //       const fromTokenPrice = result.data.price;
        
  //       const toTokenResult = await getTokenPriceRequest({
  //         symbol: toToken?.symbol,
  //         network: selectedWallet?.network,
  //       }).unwrap();
  
  //       if (toTokenResult.ok && toTokenResult.data) {
  //         const toTokenPrice = toTokenResult.data.price;
          
  //         const conversionRate = fromTokenPrice / toTokenPrice;
  //         const convertedAmount = Number(amount) * conversionRate;
          
  //         setRate(conversionRate);
  //         setToAmount(convertedAmount.toFixed(6));
  //       }
  //     }
  //   } catch (e) {
  //     errorToast('Failed to get token price');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, 350);

  const debouncedHandleGetRate = useCallback(
    useDebounce(async (amount: string) => {
      if (!fromToken || !toToken || !selectedWallet || !amount || Number(amount) > fromToken?.balance) return;
      
      setIsLoading(true);
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
    }, 350),
    [fromToken, toToken, selectedWallet, errorToast]
  );

  const handleClearState = () => {
    setFromToken(undefined);
    setToToken(undefined);
    setFromAmount('');
    setToAmount('');
    setRate(0);
    setCurrentView('swap');
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
    if (!fromToken) return;

    setFromAmount(newAmount);

    if (Number(newAmount) > fromToken?.balance) {
      errorToast('Insufficient funds');
    }

    if (!newAmount) {
      setRate(0);
      setToAmount('');
    } else {
      debouncedHandleGetRate(newAmount);
    }
  }, [fromToken, errorToast, debouncedHandleGetRate]);

  

  const handleMaxButtonClick = () => {
    if (fromToken) {
      setFromAmount(fromToken.balance.toString());
     // debouncedHandleGetRate(fromToken.balance.toString());
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
    }
   // debouncedHandleGetRate(fromAmount);
  };

  const handleSelectToToken = (token: Token) => {
    setToToken(token);
    setCurrentView('swap');
    if (token.id === fromToken?.id) {
      setFromToken(undefined);
    }
   // debouncedHandleGetRate(fromAmount);
  };

  const handleBackToSwap = () => {
    setCurrentView('swap');
  };

  // useEffect(() => {
  //   if (isSwapWindowOpen && fromToken) {
  //     debouncedHandleGetRate(fromAmount);
  //   }
  // }, [isSwapWindowOpen, fromToken]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    debouncedHandleGetRate(toAmount);
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
    },
  };
};

export type UseSwapWindowLogic = ReturnType<typeof useSwapWindowLogic>;