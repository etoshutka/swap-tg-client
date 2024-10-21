import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedWallet, walletActions, Wallet } from '@/entities/Wallet';
import { walletApi } from '@/entities/Wallet/api/walletApi';
import { ApiResponse } from '@/shared/lib/types/apiResponse';

export const useWalletUpdater = (initialInterval = 30000) => {
  const selectedWallet = useSelector(getSelectedWallet);
  const dispatch = useDispatch();
  const [getWalletSilent] = walletApi.useLazyGetWalletSilentQuery();
  const [updateInterval, setUpdateInterval] = useState(initialInterval);
  const lastUpdateTime = useRef(0);
  const isUpdating = useRef(false);
  const errorCount = useRef(0);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const resetUpdateState = useCallback(() => {
    isUpdating.current = false;
    errorCount.current = 0;
    setUpdateInterval(initialInterval);
  }, [initialInterval]);

  const updateWalletData = useCallback(async () => {
    if (!selectedWallet || isUpdating.current) return;

    const now = Date.now();
    if (now - lastUpdateTime.current < 15000) return;

    isUpdating.current = true;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      const response = await Promise.race([
        getWalletSilent(selectedWallet.id),
        timeoutPromise
      ]);

      
      if ('data' in response && response.data && 'data' in response.data) {
        const walletData = response.data.data as Wallet;
        dispatch(walletActions.setSelectedWallet(walletData));
        lastUpdateTime.current = now;
        errorCount.current = 0;
        setUpdateInterval(initialInterval);
      }
    } catch (error) {
     
      errorCount.current += 1;

      if (errorCount.current > 3) {
        setUpdateInterval(prev => Math.min(prev * 2, 60000));
      }
      
      if (errorCount.current > 5) {
        resetUpdateState();
      }
    } finally {
      isUpdating.current = false;
    }
  }, [selectedWallet, getWalletSilent, dispatch, initialInterval, resetUpdateState]);

  useEffect(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    intervalId.current = setInterval(updateWalletData, updateInterval);

    if (selectedWallet && !isUpdating.current) {
      updateWalletData();
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [updateWalletData, updateInterval, selectedWallet]);

  useEffect(() => {
    resetUpdateState();
  }, [selectedWallet?.id, resetUpdateState]);

  return { 
    updateWalletData,
    isUpdating: isUpdating.current,
    currentInterval: updateInterval 
  };
};