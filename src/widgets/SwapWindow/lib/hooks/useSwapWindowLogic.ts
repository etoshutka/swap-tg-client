import { getSelectedWallet, Network, Token, Wallet, walletApi, GetTokenInfoResult } from '@/entities/Wallet';
import { getIsWindowOpen, getWindowsOpen, globalActions, GlobalWindow } from '@/entities/Global';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useMemo } from 'react';

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
  const [customTokenAddress, setCustomTokenAddress] = useState<string>('');
  const [customTokenInfo, setCustomTokenInfo] = useState<GetTokenInfoResult | undefined>();

  const [getTokenPriceRequest] = walletApi.useLazyGetTokenPriceQuery();
  const [getTokenInfoRequest] = walletApi.useLazyGetTokenInfoQuery();
  const [swapRequest, { isLoading: isSwapLoading }] = walletApi.useSwapMutation();
  const [addTokenRequest] = walletApi.useAddWalletTokenMutation();
  const [getWalletsRequest] = walletApi.useLazyGetWalletsQuery();

  const selectedWallet: Wallet | undefined = useSelector(getSelectedWallet);
  const isSwapWindowOpen: boolean = useSelector(getWindowsOpen).some((w) => w.window === GlobalWindow.Swap);
  const isConfirmSwapWindowOpen: boolean = useSelector(getWindowsOpen).some((w) => w.window === GlobalWindow.ConfirmSwap);

  const fromTokens = useMemo(() => 
    selectedWallet?.tokens ? selectedWallet.tokens.filter((t) => t.balance > 0) : [],
    [selectedWallet]
  );

  const toTokens = useMemo(() => 
    selectedWallet?.tokens ? selectedWallet.tokens : [],
    [selectedWallet]
  );

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
          
          setRate(convertedAmount);
          setToAmount(convertedAmount.toFixed(6));
        }
      }
    } catch (e) {
      errorToast('Failed to get token price');
    } finally {
      setIsLoading(false);
    }
  }, 800);

  const handleGetCustomTokenInfo = useDebounce(async (tokenAddress: string) => {
    try {
      if (!tokenAddress || !selectedWallet) return;
      setIsLoading(true);

      const result = await getTokenInfoRequest({
        network: selectedWallet.network,
        contract: tokenAddress,
      }).unwrap();

      setCustomTokenInfo(result.data);
    } catch (e) {
      errorToast('Failed to get token info');
    } finally {
      setIsLoading(false);
    }
  }, 800);

  const handleAddCustomToken = async () => {
    try {
      if (!selectedWallet || !customTokenAddress) return;
      setIsLoading(true);

      const isTokenAlreadyAdded: boolean = selectedWallet.tokens.some((t) => t.contract === customTokenAddress);

      if (isTokenAlreadyAdded) {
        errorToast('Token already added');
        return;
      }

      const result = await addTokenRequest({
        wallet_id: selectedWallet.id,
        wallet_address: selectedWallet.address,
        network: selectedWallet.network,
        contract: customTokenAddress,
      }).unwrap();

      if (result.ok) {
        successToast('Token added');
        getWalletsRequest();
        // Обновляем toToken новым токеном
        setToToken({
          ...customTokenInfo!,
          id: customTokenAddress,
          balance: 0,
          balance_usd: 0,
        } as Token);
      }
    } catch (e) {
      errorToast('Failed to add token');
    } finally {
      setCustomTokenInfo(undefined);
      setIsLoading(false);
      setCustomTokenAddress('');
    }
  };

  const handleCustomTokenAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTokenAddress(e.target.value);
    if (e.target.value) {
      handleGetCustomTokenInfo(e.target.value);
    } else {
      setCustomTokenInfo(undefined);
    }
  };

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
      }
    } catch (e) {
      errorToast('Failed to swap tokens');
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    if (!fromToken) return;

    if (Number(e.target.value) > fromToken?.balance) {
      errorToast('Insufficient funds');
    }

    setFromAmount(e.target.value);
    handleGetRate(e.target.value);
  };

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
    }
    handleGetRate(fromAmount);
  };

  const handleSelectToToken = (token: Token) => {
    setToToken(token);
    setCurrentView('swap');
    if (token.id === fromToken?.id) {
      setFromToken(undefined);
    }
    handleGetRate(fromAmount);
  };

  const handleBackToSwap = () => {
    setCurrentView('swap');
  };

  useEffect(() => {
    if (isSwapWindowOpen && fromToken) {
      handleGetRate(toAmount);
    }
  }, [isSwapWindowOpen, fromToken]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    handleGetRate(toAmount);
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
      handleCustomTokenAddressChange,
      handleAddCustomToken,
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
      customTokenAddress,
      customTokenInfo,
    },
  };
};

export type UseSwapWindowLogic = ReturnType<typeof useSwapWindowLogic>;