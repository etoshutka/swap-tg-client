import React from 'react';
import { UseSwapWindowLogic } from '../lib/hooks/useSwapWindowLogic';
import { Typography } from '@/shared/ui/Typography/Typography';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Window } from '@/shared/ui/Window/Window';
import { Flex } from '@/shared/ui/Flex/Flex';
import Image from 'next/image';
import { getTokenImage } from '@/fsdpages/WalletPage';
import { Token } from '@/entities/Wallet';

export interface ConfirmSwapWindowProps {
  logic: UseSwapWindowLogic;
}

export const ConfirmSwapWindow: React.FC<ConfirmSwapWindowProps> = (props) => {
  const { flow, state } = props.logic;

  const renderTokenBlock = (amount: string, token: Token | undefined, isFrom: boolean) => (
    <Flex align="center" gap={12} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '12px', width: '100%' }}>
      {token && (
        <Image src={getTokenImage(token)} alt={`${token.symbol} icon`} width={32} height={32} />
      )}
      <Flex direction="column">
        <Typography.Title text={amount} fontFamily="ClashDisplay-Bold" fontSize={28} />
        <Typography.Text text={token?.symbol || ''} type="secondary" />
      </Flex>
    </Flex>
  );

  return (
    <Window isOpen={state.isConfirmSwapWindowOpen} zIndex={5006} btnOnClick={flow.handleSwapConfirm} btnText="Confirm" isBtnActive>
      <WindowHeader title="Confirm Swap" isLoading={state.isLoading} />
      <Flex width="100%" direction="column" align="center" gap={24} style={{ padding: '0 16px' }}>
        <Flex width="100%" direction="column" align="center" gap={12}>
          {renderTokenBlock(state.fromAmount, state.fromToken, true)}
          <Typography.Text text="↓" type="secondary" fontSize={24} />
          {renderTokenBlock(state.toAmount, state.toToken, false)}
        </Flex>

        <Flex width="100%" direction="column" gap={16} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '12px' }}>
          <Flex width="100%" justify="space-between">
            <Typography.Text text="Rate" type="secondary" />
            <Typography.Text text={`1 ${state.fromToken?.symbol} = ${state.rate.toFixed(6)} ${state.toToken?.symbol}`} />
          </Flex>
          <Flex width="100%" justify="space-between">
            <Typography.Text text="Network fee" type="secondary" />
            <Typography.Text text="≈ 0.1 $" />
          </Flex>
        </Flex>

        <Typography.Description 
          text="Please make sure you are swapping to the correct token" 
          align="center" 
          type="secondary" 
          fontSize={14}
        />
      </Flex>
    </Window>
  );
};