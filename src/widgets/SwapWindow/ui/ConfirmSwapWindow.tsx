import { UseSwapWindowLogic } from '../lib/hooks/useSwapWindowLogic';
import { Typography } from '@/shared/ui/Typography/Typography';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Window } from '@/shared/ui/Window/Window';
import { Flex } from '@/shared/ui/Flex/Flex';
import React from 'react';

export interface ConfirmSwapWindowProps {
  logic: UseSwapWindowLogic;
}

export const ConfirmSwapWindow: React.FC<ConfirmSwapWindowProps> = (props) => {
  const { flow, state } = props.logic;

  return (
    <Window isOpen={state.isConfirmSwapWindowOpen} zIndex={5006} btnOnClick={flow.handleSwapConfirm} btnText="Confirm" isBtnActive>
      <WindowHeader title="Confirm Swap" isLoading={state.isLoading} />
      <Flex width="100%" direction="column" align="center" gap={24}>
        <Flex width="100%" direction="column" align="center" gap={12}>
          <Flex align="center" gap={9}>
            <Typography.Title text={state.fromAmount} fontFamily="ClashDisplay-Bold" />
            <Typography.Title text={state.fromToken?.symbol} fontFamily="ClashDisplay-Bold" />
          </Flex>
          <Typography.Text text="↓" type="secondary" />
          <Flex align="center" gap={9}>
            <Typography.Title text={state.toAmount} fontFamily="ClashDisplay-Bold" />
            <Typography.Title text={state.toToken?.symbol} fontFamily="ClashDisplay-Bold" />
          </Flex>
        </Flex>

        <Flex width="100%" direction="column" gap={8}>
          <Flex width="100%" justify="space-between">
            <Typography.Text text="Rate" type="secondary" />
            <Typography.Text text={`1 ${state.fromToken?.symbol} = ${state.rate} ${state.toToken?.symbol}`} />
          </Flex>
          <Flex width="100%" justify="space-between">
            <Typography.Text text="Network fee" type="secondary" />
            <Typography.Text text="≈ 0.1 $" />
          </Flex>
        </Flex>

        <Typography.Description text="Please make sure you are swapping to the correct token" align="center" type="secondary" />
      </Flex>
    </Window>
  );
};