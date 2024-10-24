'use client';

import { ArrowOutlineIcon } from '@/shared/assets/icons/ArrowOutlineIcon';
import { DepositFillIcon } from '@/shared/assets/icons/DepositFillIcon';
import { WalletPageToken } from '../WalletPageToken/WalletPageToken';
import { globalActions, GlobalWindow } from '@/entities/Global';
import { Typography } from '@/shared/ui/Typography/Typography';
import { getSelectedWallet, Wallet, Token, Network, walletApi } from '@/entities/Wallet';
import { useDispatch, useSelector } from 'react-redux';
import styles from './WalletPageTokens.module.scss';
import { Button } from '@/shared/ui/Button/Button';
import { Flex } from '@/shared/ui/Flex/Flex';
import React, { useState, useMemo } from 'react';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { AnimatePresence, motion } from 'framer-motion';

const TOKEN_HEIGHT = 66;
const SPACING = 12;
const MAX_VISIBLE_TOKENS = 4;

const isEssentialToken = (token: Token, network: Network): boolean => {
  switch (network) {
    case Network.ETH:
      return token.symbol === 'ETH' || token.symbol === 'USDT';
    case Network.BSC:
      return token.symbol === 'BNB' || token.symbol === 'USDT';
    case Network.SOL:
      return token.symbol === 'SOL' || token.symbol === 'USDT';
    case Network.TON:
      return token.symbol === 'TON' || token.symbol === 'USDT';
    default:
      return false;
  }
};

export const WalletPageTokens = () => {
  const dispatch = useDispatch();
  const { errorToast, successToast } = useToasts();
  const [getWalletsRequest] = walletApi.useLazyGetWalletsQuery();
  const [deleteWalletToken] = walletApi.useDeleteWalletTokenMutation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const selectedWallet: Wallet | undefined = useSelector(getSelectedWallet);

  const tokens = selectedWallet?.tokens || [];
  const visibleTokens = useMemo(() => {
    return isCollapsed ? tokens.slice(0, MAX_VISIBLE_TOKENS) : tokens;
  }, [tokens, isCollapsed]);

  const handleDeleteToken = async (token: Token) => {
    if (!selectedWallet) return;
    try {
      const result = await deleteWalletToken({
        wallet_id: selectedWallet.id,
        token_id: token.id,
      }).unwrap();
      if (result.ok) {
        successToast('Token deleted');
        getWalletsRequest();
      } else {
        errorToast('Failed to delete token');
      }
    } catch (e) {
      errorToast('Failed to delete token');
    }
  };

  const handleShowMoreClick = (): void => {
    setIsCollapsed(prev => !prev);
  };

  const handleAddTokenButtonClick = async (): Promise<void> => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.AddToken }));
  };

  const initialHeight = Math.min(MAX_VISIBLE_TOKENS, tokens.length) * TOKEN_HEIGHT + 
                       (Math.min(MAX_VISIBLE_TOKENS, tokens.length) - 1) * SPACING;

  return (
    <Flex width="100%" direction="column" gap={8}>
      <motion.div
        initial={{ height: initialHeight }}
        animate={{ height: isCollapsed ? initialHeight : 'auto' }}
        transition={{ duration: 0.3 }}
        className={styles.tokens_list}
      >
        <AnimatePresence>
          {visibleTokens.map((token) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WalletPageToken
                token={token}
                isEssentialToken={selectedWallet?.network ? isEssentialToken(token, selectedWallet.network) : false}
                onDeleteToken={handleDeleteToken}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {tokens.length > MAX_VISIBLE_TOKENS && (
        <Button type="text" onClick={handleShowMoreClick}>
          <Typography.Text 
            text={isCollapsed ? 'Show more' : 'Show less'} 
            type="secondary" 
            weight={400} 
            fontSize={16} 
          />
          <ArrowOutlineIcon 
            style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }} 
          />
        </Button>
      )}

      <Button 
        type="primary" 
        height={50} 
        className={styles.add_token_btn} 
        onClick={handleAddTokenButtonClick}
      >
        <DepositFillIcon width={17} height={17} fill="white" />
        <Typography.Text text="Add token" color="white" fontSize={17} />
      </Button>
    </Flex>
  );
};