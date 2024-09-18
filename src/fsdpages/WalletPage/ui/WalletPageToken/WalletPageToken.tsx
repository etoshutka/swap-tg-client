import { Typography } from '@/shared/ui/Typography/Typography';
import { getTokenImage } from '../../lib/helpers/getTokenImage';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Token } from '@/entities/Wallet';
import Image from 'next/image';
import React from 'react';

export interface WalletTokenProps {
  token: Token;
  isHidePrice?: boolean;
  onTokenClick?: (token: Token) => void;
}

export const WalletPageToken: React.FC<WalletTokenProps> = ({ token, ...props }) => {
  const handleTokenClick = () => {
    props.onTokenClick && props.onTokenClick(token);
  };

  if (props.isHidePrice) {
    return (
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
            <Typography.Text text={`${token.name} (${token.symbol})`} weight={550} width="250px" wrap="nowrap" />
            <Typography.Text text={`${token.balance} ${token.symbol}`} weight={450} align="left" wrap="nowrap" type="secondary" />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
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
          <Typography.Text text={`${token.name} (${token.symbol})`} weight={550} width="135px" wrap="nowrap" />
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
        </Flex>
      </Flex>

      <Flex direction="column" align="flex-end" gap={3}>
        <Typography.Text text={`${token.balance} ${token.symbol}`} weight={550} align="right" wrap="nowrap" />
        <Typography.Text text={`${token.balance_usd.toFixed(2)}$`} type="secondary" align="right" wrap="nowrap" />
      </Flex>
    </Flex>
  );
};
