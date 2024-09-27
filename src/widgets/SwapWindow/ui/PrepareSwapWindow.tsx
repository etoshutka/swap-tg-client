import React from 'react';
import { UseSwapWindowLogic } from '../lib/hooks/useSwapWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { getTokenImage } from '@/fsdpages/WalletPage';
import { Window } from '@/shared/ui/Window/Window';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import Image from 'next/image';
import SwapIcon from '@/shared/assets/icons/swap-icon.svg';
import ArrowIcon from '@/shared/assets/icons/arrow-icon.svg';

interface SwapWindowProps {
  logic: UseSwapWindowLogic;
}

export const PrepareSwapWindow: React.FC<SwapWindowProps> = ({ logic }) => {
  const { flow, state } = logic;

  const handlePercentageClick = (percentage: number) => {
    if (state.fromToken && state.fromToken.balance !== undefined) {
      const amount = (state.fromToken.balance * percentage).toFixed(6);
      flow.handleFromAmountChange({ target: { value: amount } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const TokenBlock = ({ isFrom }: { isFrom: boolean }) => {
    const token = isFrom ? state.fromToken : state.toToken;
    const amount = isFrom ? state.fromAmount : state.toAmount;
    const handleChange = isFrom ? flow.handleFromAmountChange : undefined;
    const handleSelect = isFrom ? flow.handleOpenSelectFromTokenModal : flow.handleOpenSelectToTokenModal;

    return (
      <Flex direction="column" width="100%" bg="white" padding={16} radius={16} style={{ marginBottom: '8px' }}>
        <div style={{ color: '#888', marginBottom: '8px' }}>{isFrom ? "You give" : "You receive"}</div>
        <Flex align="center" justify="space-between">
          <Input
            type="number"
            value={amount}
            onChange={handleChange}
            placeholder="0"
          />
          <Flex align="center" onClick={handleSelect} style={{ cursor: 'pointer' }}>
            {token && (
              <Image 
                src={getTokenImage(token)} 
                alt={`${token.symbol} icon`} 
                width={24} 
                height={24} 
                style={{ marginRight: '8px' }}
              />
            )}
            <span style={{ marginRight: '4px' }}>{token ? token.symbol : "Select token"}</span>
            <Image src={ArrowIcon} alt="Select token" width={12} height={12} />
          </Flex>
        </Flex>
        <Flex justify="space-between" align="center" style={{ marginTop: '8px' }}>
          <div style={{ color: '#888' }}>${(Number(amount) * (token?.price || 0)).toFixed(2)}</div>
          <div style={{ color: '#888' }}>Balance: {token?.balance?.toFixed(2) || '0.00'}</div>
        </Flex>
        {isFrom && (
          <Flex gap={8} style={{ marginTop: '12px' }}>
            {['25%', '50%', '75%', 'Max'].map((percent, index) => (
              <Button 
                key={percent}
                onClick={() => index === 3 ? flow.handleMaxButtonClick() : handlePercentageClick((index + 1) * 0.25)}
                style={{ 
                  backgroundColor: '#f0f0f0', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '14px',
                  flex: 1
                }}
              >
                {percent}
              </Button>
            ))}
            <Button 
              onClick={flow.handleSwapTokens} 
              style={{ 
                backgroundColor: '#f0f0f0', 
                padding: '8px', 
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image src={SwapIcon} alt="Swap tokens" width={16} height={16} />
            </Button>
          </Flex>
        )}
      </Flex>
    );
  };

  const CustomTokenInput = () => (
    <Flex direction="column" width="100%" bg="white" padding={16} radius={16} style={{ marginTop: '16px' }}>
      <Input
        label="Add custom token"
        placeholder="Enter token address"
        value={state.customTokenAddress}
        onChange={flow.handleCustomTokenAddressChange}
      />
      {state.customTokenInfo && (
        <Flex align="center" justify="space-between" style={{ marginTop: '8px' }}>
          <Image 
            src={state.customTokenInfo.icon} 
            alt={`${state.customTokenInfo.symbol} icon`} 
            width={24} 
            height={24} 
            style={{ marginRight: '8px' }}
          />
          <span>{state.customTokenInfo.name} ({state.customTokenInfo.symbol})</span>
          <Button onClick={flow.handleAddCustomToken}>Add Token</Button>
        </Flex>
      )}
    </Flex>
  );

  return (
    <Window
      isOpen={state.isSwapWindowOpen}
      btnText="Continue"
      zIndex={5005}
      btnOnClick={flow.handleOpenConfirmWindow}
      isBtnDisabled={state.isSwapButtonDisabled}
      isBtnActive
    >
      <WindowHeader title="Swap" isLoading={state.isLoading} />

      <Flex width="100%" direction="column" style={{ position: 'relative' }}>
        <TokenBlock isFrom={true} />
        <TokenBlock isFrom={false} />
        <CustomTokenInput />
      </Flex>
    </Window>
  );
};