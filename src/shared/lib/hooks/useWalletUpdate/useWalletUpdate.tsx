import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedWallet, walletActions, Wallet } from '@/entities/Wallet';
import { walletApi } from '@/entities/Wallet/api/walletApi';
import { ApiResponse } from '@/shared/lib/types/apiResponse';

interface WalletApiError {
  message: string;
  status?: number;
}

export const useWalletUpdater = () => {
  const selectedWallet = useSelector(getSelectedWallet);
  const dispatch = useDispatch();
  const [getWalletSilent] = walletApi.useLazyGetWalletSilentQuery();
  const lastUpdateTime = useRef(0);
  const isUpdating = useRef(false);
  const delayedUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  // Очистка таймаута
  const clearDelayedUpdate = useCallback(() => {
    if (delayedUpdateTimeout.current) {
      clearTimeout(delayedUpdateTimeout.current);
      delayedUpdateTimeout.current = null;
    }
  }, []);

  const updateWalletData = useCallback(async () => {
    if (isUpdating.current) return;

    const now = Date.now();
    if (!selectedWallet || now - lastUpdateTime.current < 3000) return;

    isUpdating.current = true;

    try {
      const result = await getWalletSilent(selectedWallet.id).unwrap();
      if (result?.data) {
        dispatch(walletActions.setSelectedWallet(result.data));
        lastUpdateTime.current = now;
      }
    } catch (error) {
      console.error('Failed to update wallet data:', error);
    } finally {
      isUpdating.current = false;
    }
  }, [selectedWallet, getWalletSilent, dispatch]);

  // Обновление с задержкой
  const updateAfterDelay = useCallback((delay: number) => {
    clearDelayedUpdate(); // Очищаем предыдущий таймаут, если есть

    delayedUpdateTimeout.current = setTimeout(() => {
      updateWalletData();
    }, delay);
  }, [updateWalletData, clearDelayedUpdate]);

  // Очистка при размонтировании
  useEffect(() => {
    return clearDelayedUpdate;
  }, [clearDelayedUpdate]);

  return {
    updateWalletData,
    updateAfterDelay
  };
};
