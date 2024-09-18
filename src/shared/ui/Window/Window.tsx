import { AnimatePresence, motion } from 'framer-motion';
import { Flex } from '@/shared/ui/Flex/Flex';
import styles from './Window.module.scss';
import cn from 'classnames';
import React from 'react';

export interface WindowProps {
  isOpen: boolean;
  title?: string;
  height?: React.CSSProperties['height'];
  setIsOpen?: (status?: boolean) => void;
  onClose?: () => void;
  children?: React.ReactNode;
  subtitle?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  isScrollable?: boolean;
  bg?: React.CSSProperties['background'];
  maskBgColor?: React.CSSProperties['background'];
  maskBgBorderRadius?: React.CSSProperties['borderRadius'];
  paddingTop?: React.CSSProperties['paddingTop'];
  borderRadius?: React.CSSProperties['borderRadius'];
  wrapperBorderRadius?: React.CSSProperties['borderRadius'];
  zIndex?: number;
  btnIcon?: React.ReactNode;
  btnText?: string;
  btnOnClick?: () => void;
  btnType?: 'danger';
  isBtnActive?: boolean;
  isBtnDisabled?: boolean;
}

export const Window: React.FC<WindowProps> = ({ isOpen, setIsOpen, ...props }) => {
  const btnStyleOptions: Record<any, boolean | undefined> = {
    [styles.danger]: props.btnType === 'danger',
    [styles.disabled]: props.isBtnDisabled,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(styles.window_wrapper, {
            [styles.scrollable]: props.isScrollable,
          })}
          style={{
            zIndex: props.zIndex,
            paddingTop: props.paddingTop,
            borderRadius: props.wrapperBorderRadius,
          }}
        >
          <motion.div
            exit={{ transform: `translate(100%, 0)`, boxShadow: 'none' }}
            animate={{ transform: `translate(0, 0)`, boxShadow: '0 0 64px 0 rgba(0, 0, 0, 0.06)' }}
            initial={{ transform: `translate(100%, 0)`, boxShadow: 'none' }}
            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
            className={cn(styles.window)}
            style={{
              height: props.height,
              background: props.bg,
              borderRadius: props.borderRadius,
            }}
            onScroll={props.onScroll}
          >
            <Flex className={styles.content} style={{ height: props.isBtnActive ? 'calc(100% - 90.5px)' : '100%' }}>
              {props.children}
            </Flex>

            {props.isBtnActive && (
              <Flex className={styles.footer}>
                <Flex className={cn(styles.footer_btn, btnStyleOptions)} onClick={props.btnOnClick}>
                  {props.btnIcon && props.btnIcon}
                  {props.btnText ?? 'Label'}
                </Flex>
              </Flex>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
