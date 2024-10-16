'use client';

import { ArrowOutlineIcon } from '@/shared/assets/icons/ArrowOutlineIcon';
import { DepositFillIcon } from '@/shared/assets/icons/DepositFillIcon';
import { WalletPageToken } from '../WalletPageToken/WalletPageToken';
import { globalActions, GlobalWindow } from '@/entities/Global';
import { Typography } from '@/shared/ui/Typography/Typography';
import { getSelectedWallet, Wallet, Token } from '@/entities/Wallet';
import { useDispatch, useSelector } from 'react-redux';
import styles from './WalletPageTokens.module.scss';
import { Button } from '@/shared/ui/Button/Button';
import { Flex } from '@/shared/ui/Flex/Flex';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletPageLogic } from '../../lib/hooks/useWalletPageLogic';

export const WalletPageTokens = () => {
  const dispatch = useDispatch();
  const { flow, state } = useWalletPageLogic();
  
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const selectedWallet: Wallet | undefined = useSelector(getSelectedWallet);
  
  const handleShowMoreClick = (): void => {
    setTimeout(() => setIsCollapsed((prev) => !prev), window.scrollY > 0 ? 250 : 0);
  };
  
  const handleAddTokenButtonClick = async (): Promise<void> => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.AddToken }));
  };

  useEffect(() => {
    // Обновление списка токенов при изменении selectedWallet
  }, [selectedWallet]);

  return (
    <Flex width="100%" direction="column" gap={12}>
      <motion.div 
        initial={{ height: 132 }} 
        animate={{ height: isCollapsed ? 132 : 'auto' }} 
        className={styles.tokens_list}
      >
        <AnimatePresence>
          {selectedWallet?.tokens && selectedWallet.tokens.map((token) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WalletPageToken 
                token={token} 
                onDeleteToken={flow.handleDeleteToken}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {selectedWallet?.tokens && selectedWallet.tokens?.length > 2 && (
        <Button type="text" onClick={handleShowMoreClick}>
          <Typography.Text text={isCollapsed ? 'Show more' : 'Show less'} type="secondary" weight={400} fontSize={16} />
          <ArrowOutlineIcon style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }} />
        </Button>
      )}
      
      <Button type="primary" height={50} className={styles.add_token_btn} onClick={handleAddTokenButtonClick}>
        <DepositFillIcon width={17} height={17} fill="white" />
        <Typography.Text text="Add token" color="white" fontSize={17} />
      </Button>
    </Flex>
  );
};