'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Typography } from '@/shared/ui/Typography/Typography';
import { getTokenImage } from '../../lib/helpers/getTokenImage';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Token } from '@/entities/Wallet';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';
import Trash from '@/shared/assets/icons/trash.svg'

// Утилита для объединения refs
const mergeRefs = (...refs: React.Ref<any>[]) => {
  return (node: any) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<any>).current = node;
      }
    });
  };
};

export interface WalletTokenProps {
  token: Token;
  isHidePrice?: boolean;
  onTokenClick?: (token: Token) => void;
  onDeleteToken?: (token: Token) => void;
}

export const WalletPageToken: React.FC<WalletTokenProps> = ({ token, onDeleteToken, ...props }) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const deleteButtonWidth = 80; // ширина кнопки удаления

  const updateTransform = (offset: number) => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translateX(${-offset}px)`;
    }
  };

  const { ref: swipeableRef, ...swipeHandlers } = useSwipeable({
    onSwiping: (e) => {
      if (e.dir === 'Left') {
        const newOffset = Math.min(deleteButtonWidth, Math.max(0, -e.deltaX));
        updateTransform(newOffset);
      } else if (e.dir === 'Right') {
        const currentOffset = isSwiped ? deleteButtonWidth : 0;
        const newOffset = Math.max(0, currentOffset - e.deltaX);
        updateTransform(newOffset);
      }
    },
    onSwipedLeft: () => {
      setIsSwiped(true);
      updateTransform(deleteButtonWidth);
    },
    onSwipedRight: () => {
      setIsSwiped(false);
      updateTransform(0);
    },
    trackMouse: true,
    trackTouch: true,
  });

  const handleTokenClick = () => {
    if (!isSwiped && props.onTokenClick) {
      props.onTokenClick(token);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteToken) {
      onDeleteToken(token);
    }
    setIsSwiped(false);
    updateTransform(0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsSwiped(false);
        updateTransform(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mergedRef = useMemo(
    () => mergeRefs(wrapperRef, swipeableRef),
    [swipeableRef]
  );

  const renderTokenContent = () => (
    <Flex
      width="100%"
      align="center"
      radius="16px"
      height="60px"
      padding="10px 16px"
      justify="space-between"
      bg="var(--secondaryBg)"
      onClick={handleTokenClick}
    >
      <Flex align="center" gap={12}>
        <Image width={40} height={40} src={getTokenImage(token)} alt="token-icon" priority />
        <Flex direction="column" gap={3}>
          <Typography.Text text={`${token.name} (${token.symbol})`} weight={550} width={props.isHidePrice ? "250px" : "135px"} wrap="nowrap" />
          {props.isHidePrice ? (
            <Typography.Text text={`${token.balance} ${token.symbol}`} weight={450} align="left" wrap="nowrap" type="secondary" />
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
                    color={token.price_change_percentage > 0 ? 'var(--green)' : 'var(--red)'}
                  />
                </>
              }
            />
          )}
        </Flex>
      </Flex>

      {!props.isHidePrice && (
        <Flex direction="column" align="flex-end" gap={3}>
          <Typography.Text text={`${token.balance !== 0 ? token.balance.toFixed(4) : token.balance.toFixed(0)} ${token.symbol}`} weight={550} align="right" wrap="nowrap" />
          <Typography.Text text={`${token.balance_usd.toFixed(2)}$`} type="secondary" align="right" wrap="nowrap" />
        </Flex>
      )}
    </Flex>
  );

  return (
    <div 
      ref={mergedRef}
      {...swipeHandlers}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div 
        ref={contentRef}
        style={{
          transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          willChange: 'transform'
        }}
      >
        {renderTokenContent()}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: `${deleteButtonWidth}px`,
          background: 'var(--primaryBg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transform: `translateX(${isSwiped ? '0' : '100%'})`,
          transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
        onClick={handleDelete}
      >
        <Flex align="center" gap={8}>
          <Image src={Trash} alt="" width={24} height={24} />
          <Typography.Text text="Delete" type="secondary" />
        </Flex>
      </div>
    </div>
  );
};