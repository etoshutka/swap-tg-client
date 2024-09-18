'use client';

import { getIsGlobalLoading, getWindowsOpen, GlobalWindow, GlobalWindowType } from '@/entities/Global';
import { Typography } from '@/shared/ui/Typography/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from '@/shared/ui/Spinner/Spinner';
import styles from './LoadingWindow.module.scss';
import { Flex } from '@/shared/ui/Flex/Flex';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';

export const LoadingWindow = () => {
  const [zIndex, setZIndex] = React.useState(10000);
  const isGlobalLoading: boolean = useSelector(getIsGlobalLoading);
  const windows: GlobalWindowType<GlobalWindow>[] = useSelector(getWindowsOpen);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isGlobalLoading) {
      timer = setTimeout(() => {
        setZIndex(-1);
      }, 0.6 * 1000);
    } else {
      setZIndex(10000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isGlobalLoading]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isGlobalLoading && windows.length === 0 ? 1 : 0, zIndex }}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.6 }}
        className={styles.loading_window}
      >
        <Flex direction="column" align="center" gap={12}>
          <Spinner size="lg" />
          <Typography.Description text="App initialization, please wait few moments..." align="center" width="150px" type="secondary" fontSize={16} />
        </Flex>
      </motion.div>
    </AnimatePresence>
  );
};
