import React from 'react';
import { Token } from '@/entities/Wallet';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';
import Image from 'next/image';
import { getTokenImage } from '@/fsdpages/WalletPage';

interface SelectTokenPageProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  onBack: () => void;
  title: string;
}

export const SelectTokenPage: React.FC<SelectTokenPageProps> = ({
  tokens,
  onSelectToken,
  onBack,
  title,
}) => {
  return (
    <Flex direction="column" gap={12}>
      <Button 
        onClick={onBack} 
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '20px',
          backgroundColor: '#f0f0f0',
          justifyContent: 'center', // Центрирование содержимого кнопки
        }}
      >
        <Typography.Text text="Back to Swap" />
      </Button>
      <Typography.Title 
        text={title}
        align="center"
      />
      {tokens.map((token) => (
        <Button
          key={token.id}
          onClick={() => onSelectToken(token)}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            padding: '12px',
            borderRadius: '12px',
          }}
        >
          <Flex align="center" gap={12} style={{ width: '100%' }}>
            <Image src={getTokenImage(token)} alt={token.symbol} width={32} height={32} />
            <Flex direction="column" align="flex-start">
              <Typography.Text text={token.symbol} weight="bold" />
              <Typography.Text text={token.name} type="secondary" />
            </Flex>
            <Flex style={{ marginLeft: 'auto' }}>
              <Typography.Text text={`${token.balance} ${token.symbol}`} />
            </Flex>
          </Flex>
        </Button>
      ))}
    </Flex>
  );
};