import { useDepositWindowLogic } from '../lib/hooks/useDepositWindowLogic';
import { CopyFillIcon } from '@/shared/assets/icons/CopyFillIcon';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Typography } from '@/shared/ui/Typography/Typography';
import { networkIconsUrl } from '@/shared/consts/networkIcons';
import { networkSymbol } from '@/shared/consts/networkSymbol';
import { Window } from '@/shared/ui/Window/Window';
import { Button } from '@/shared/ui/Button/Button';
import { Field } from '@/shared/ui/Field/Field';
import { Flex } from '@/shared/ui/Flex/Flex';
import { QRCode } from 'antd';
import React from 'react';

export const DepositWindow = () => {
  const { flow, state } = useDepositWindowLogic();

  return (
    <Window isOpen={state.isWindowOpen}>
      <WindowHeader
        title="Deposit"
        description={
          <>
            Send only <Typography.Text text={`${state.network} tokens`} weight={600} fontSize={16} /> on the{' '}
            <Typography.Text text={`${state.network && networkSymbol[state.network]} network`} weight={600} fontSize={16} /> to this address. Any
            other assets will be irretrievably lost.
          </>
        }
      />

      <Flex width="100%" direction="column" gap={12}>
        <Field direction="column" padding="20px 30px" gap={15}>
          {state.network && <QRCode value={`${state.depositAddress}`} icon={networkIconsUrl[state.network]} bordered={false} />}
          <Typography.Text
            text={
              <>
                Scan the QR code to send {state.network && networkSymbol[state.network]} tokens <br /> to your wallet.
              </>
            }
            type="secondary"
            align="center"
            fontSize={16}
          />
        </Field>

        <Field direction="column" padding="14px 16px" gap={21}>
          <Flex width="100%" direction="column" align="center" gap={9}>
            <Typography.Text text={`Your ${state.network && networkSymbol[state.network]} address`} type="secondary" fontSize={16} />
            <Typography.Text
              text={`${state.depositAddress?.slice(0, 15)}...${state.depositAddress?.slice(-15)}`}
              wrap="nowrap"
              weight={450}
              fontSize={16}
            />
          </Flex>
          <Button type="primary" block onClick={flow.handleCopyAddress}>
            <CopyFillIcon fill="white" width={16} height={16} />
            Copy address
          </Button>
        </Field>
      </Flex>
    </Window>
  );
};
