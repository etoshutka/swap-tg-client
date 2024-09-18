import { useAddWalletWindowLogic } from '../lib/hooks/useAddWalletWindowLogic';
import { DepositFillIcon } from '@/shared/assets/icons/DepositFillIcon';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Typography } from '@/shared/ui/Typography/Typography';
import { QrIcon } from '@/shared/assets/icons/QrIcon';
import { Window } from '@/shared/ui/Window/Window';
import { Field } from '@/shared/ui/Field/Field';
import { Flex } from '@/shared/ui/Flex/Flex';

export const AddWalletWindow = () => {
  const { flow, state } = useAddWalletWindowLogic();

  return (
    <Window zIndex={5003} isOpen={state.isWindowOpen}>
      <WindowHeader title="Add Wallet" description="Import or create a new wallet" />

      <Flex width="100%" direction="column" gap={12}>
        <Field gap={12} onClick={flow.handleCreateWalletClick}>
          <DepositFillIcon />
          <Typography.Title text="Create wallet" subtitle="Create a new wallet" fontSize={16} weight={550} />
        </Field>
        <Field gap={12} onClick={flow.handleImportWalletClick}>
          <QrIcon />
          <Typography.Title text="Import wallet" subtitle="Import an existing wallet" fontSize={16} weight={550} />
        </Field>
      </Flex>
    </Window>
  );
};
