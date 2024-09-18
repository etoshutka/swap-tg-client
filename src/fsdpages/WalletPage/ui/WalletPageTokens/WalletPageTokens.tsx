'use client';

import { ArrowOutlineIcon } from '@/shared/assets/icons/ArrowOutlineIcon';
import { DepositFillIcon } from '@/shared/assets/icons/DepositFillIcon';
import { WalletPageToken } from '../WalletPageToken/WalletPageToken';
import { globalActions, GlobalWindow } from '@/entities/Global';
import { Typography } from '@/shared/ui/Typography/Typography';
import { getSelectedWallet, Wallet } from '@/entities/Wallet';
import { useDispatch, useSelector } from 'react-redux';
import styles from './WalletPageTokens.module.scss';
import { Button } from '@/shared/ui/Button/Button';
import { Flex } from '@/shared/ui/Flex/Flex';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const WalletPageTokens = () => {
  const dispatch = useDispatch();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const selectedWallet: Wallet | undefined = useSelector(getSelectedWallet);

  const handleShowMoreClick = (): void => {
    setTimeout(() => setIsCollapsed((prev) => !prev), window.scrollY > 0 ? 250 : 0);
  };

  const handleAddTokenButtonClick = async (): Promise<void> => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.AddToken }));
  };

  return (
    <Flex width="100%" direction="column" gap={12}>
      <motion.div initial={{ height: 132 }} animate={{ height: isCollapsed ? 132 : 'auto' }} className={styles.tokens_list}>
        {selectedWallet?.tokens && selectedWallet?.tokens.map((token, i) => <WalletPageToken key={token.id} token={token} />)}
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
