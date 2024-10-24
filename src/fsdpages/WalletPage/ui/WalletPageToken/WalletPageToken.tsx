'use client'

import React, { useState, useRef, useCallback } from 'react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { getTokenImage } from '../../lib/helpers/getTokenImage';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Token, walletActions } from '@/entities/Wallet';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import Trash from '@/shared/assets/icons/trash.svg'
import { globalActions, GlobalWindow } from '@/entities/Global';
import { useDispatch } from 'react-redux';
import { TokenDetailsWindow } from './TokenDetailsWindow';

export interface WalletTokenProps {
  token: Token;
  isHidePrice?: boolean;
  onTokenClick?: (token: Token) => void;
  onDeleteToken?: (token: Token) => void;
  isEssentialToken?: boolean;
}

export const WalletPageToken: React.FC<WalletTokenProps> = React.memo(({ 
  token, 
  onDeleteToken, 
  isHidePrice, 
  onTokenClick,
  isEssentialToken = false
}) => {
  const dispatch = useDispatch();
  const [isSwiped, setIsSwiped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSwipe = useCallback(({ deltaX }: { deltaX: number }) => {
    if (isEssentialToken || !contentRef.current) return;
    
    const maxOffset = 80;
    const offset = Math.max(0, Math.min(maxOffset, -deltaX));
    contentRef.current.style.transform = `translateX(${-offset}px)`;
  }, [isEssentialToken]);

  const { ref: swipeableRef, ...swipeHandlers } = useSwipeable({
    onSwiping: handleSwipe,
    onSwipedLeft: () => {
      if (!isEssentialToken && contentRef.current) {
        setIsSwiped(true);
        contentRef.current.style.transform = 'translateX(-80px)';
      }
    },
    onSwipedRight: () => {
      if (!isEssentialToken && contentRef.current) {
        setIsSwiped(false);
        contentRef.current.style.transform = 'translateX(0)';
      }
    },
    trackTouch: true,
    delta: 10, // Минимальное расстояние для определения свайпа
    preventScrollOnSwipe: true, // Предотвращает скролл при свайпе
    touchEventOptions: { passive: false } // Опции для touch-событий
  });

  const handleClick = useCallback(() => {
    if (!isSwiped) {
      dispatch(walletActions.setSelectedToken(token));
      setShowDetails(true);
      dispatch(globalActions.addWindow({ window: GlobalWindow.TokenDetails }));
      onTokenClick?.(token);
    }
  }, [isSwiped, dispatch, onTokenClick, token]);

  const priceChangeColor = token.price_change_percentage > 0 ? 'var(--green)' : 'var(--red)';
  const formattedBalance = token.balance !== 0 ? token.balance.toFixed(7) : '0';

  return (
    <div style={{ 
      position: 'relative', 
      borderRadius: '16px',
      background: 'var(--primaryBg)',
      isolation: 'isolate'
    }}>
      {!isEssentialToken && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: '80px',
            background: 'var(--primaryBg)',
            borderRadius: '0 16px 16px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteToken?.(token);
            setIsSwiped(false);
            if (contentRef.current) {
              contentRef.current.style.transform = 'translateX(0)';
            }
          }}
        >
          <Flex align="center" gap={8}>
            <Image src={Trash} alt="" width={24} height={24} />
            <Typography.Text text="Delete" type="secondary" />
          </Flex>
        </div>
      )}

      <div
        ref={mergeRefs(contentRef, swipeableRef)}
        {...(!isEssentialToken ? swipeHandlers : {})}
        style={{
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease',
          borderRadius: '16px',
          position: 'relative',
          zIndex: 2,
          background: 'var(--secondaryBg)',
        }}
      >
        <Flex
          width="100%"
          align="center"
          radius="16px"
          height="60px"
          padding="10px 16px"
          justify="space-between"
          bg="var(--secondaryBg)"
          onClick={handleClick}
        >
          <Flex align="center" gap={12}>
            <Image 
              width={40} 
              height={40} 
              src={getTokenImage(token)} 
              alt="token-icon" 
              priority 
            />
            <Flex direction="column" gap={3}>
              <Typography.Text 
                text={`${token.name} (${token.symbol})`} 
                weight={550} 
                width={isHidePrice ? "250px" : "135px"} 
                wrap="nowrap" 
              />
              {isHidePrice ? (
                <Typography.Text 
                  text={`${token.balance} ${token.symbol}`} 
                  weight={450} 
                  align="left" 
                  wrap="nowrap" 
                  type="secondary" 
                />
              ) : (
                <Typography.Text
                  type="secondary"
                  wrap="nowrap"
                  text={
                    <>
                      ${token.price.toFixed(2)}{' '}
                      <Typography.Text
                        wrap="nowrap"
                        text={`${token.price_change_percentage.toFixed(2)}%`}
                        color={priceChangeColor}
                      />
                    </>
                  }
                />
              )}
            </Flex>
          </Flex>

          {!isHidePrice && (
            <Flex direction="column" align="flex-end" gap={3}>
              <Typography.Text 
                text={`${formattedBalance} ${token.symbol}`} 
                weight={550} 
                align="right" 
                wrap="nowrap" 
              />
              <Typography.Text 
                text={`${token.balance_usd.toFixed(2)}$`} 
                type="secondary" 
                align="right" 
                wrap="nowrap" 
              />
            </Flex>
          )}
        </Flex>
      </div>

      {showDetails && <TokenDetailsWindow />}
    </div>
  );
});

WalletPageToken.displayName = 'WalletPageToken';

const mergeRefs = (...refs: React.Ref<any>[]) => (node: any) => {
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref != null) {
      (ref as React.MutableRefObject<any>).current = node;
    }
  });
};