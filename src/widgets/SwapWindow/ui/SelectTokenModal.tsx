import React, { useState } from 'react';
import { Token } from '@/entities/Wallet';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import Image from 'next/image';
import { getTokenImage } from '@/fsdpages/WalletPage';
import { DepositFillIcon } from '@/shared/assets/icons/DepositFillIcon';
import { useAddTokenWindowLogic } from '@/widgets/AddTokenWindow/lib/hooks/useAddTokenWindowLogic';

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
  const { flow, state } = useAddTokenWindowLogic();
  const [showAddToken, setShowAddToken] = useState(false);

  const handleAddToken = async () => {
    await flow.handleAddWalletToken();
    setShowAddToken(false);
  };

  return (
    <Flex direction="column" gap={12}>
      <Button 
        onClick={onBack} 
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '20px',
          backgroundColor: '#f0f0f0',
          justifyContent: 'center',
        }}
      >
        <Typography.Text text="Back to Swap" />
      </Button>
      <Typography.Title 
        text={title}
        align="center"
      />
      
      {!showAddToken ? (
        <Button
          onClick={() => setShowAddToken(true)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '20px',
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
          }}
        >
          <Typography.Text text="Add Custom Token" />
        </Button>
      ) : (
        <Flex direction="column" gap={12}>
          <Input
            label={`Enter ${state.network ? state.network : ''} token contract address`}
            placeholder="0x..."
            value={state.tokenAddress}
            onChange={flow.handleTokenAddressChange}
          />
          {state.tokenInfo && (
            <Flex justify="space-between" align="center" gap={12}>
              <Image width={40} height={40} src={state.tokenInfo.icon} alt="token-icon" style={{ borderRadius: '50%' }} />
              <Typography.Text text={`${state.tokenInfo.name} (${state.tokenInfo.symbol})`} weight={550} fontSize={16} width="100%" />
              <Typography.Text align="right" text={`${state.tokenInfo.price.toFixed(4)}$`} textOverflow="inital" wrap="nowrap" overflow="visible" />
            </Flex>
          )}
          <Button
            onClick={handleAddToken}
            disabled={!state.isBtnActive || state.isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '20px',
              backgroundColor: state.isBtnActive ? '#4CAF50' : '#f0f0f0',
              justifyContent: 'center',
            }}
          >
            <DepositFillIcon fill="white" width={14} height={14} />
            <Typography.Text text="Add Token" color={state.isBtnActive ? 'white' : 'black'} />
          </Button>
        </Flex>
      )}

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