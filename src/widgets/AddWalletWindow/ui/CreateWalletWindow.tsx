import { useCreateWalletWindowLogic } from '../lib/hooks/useCreateWalletWindowLogic';
import { DepositFillIcon } from '@/shared/assets/icons/DepositFillIcon';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { networkSymbol } from '@/shared/consts/networkSymbol';
import { NetworkSelect } from '@/features/NetworkSelect';
import { Window } from '@/shared/ui/Window/Window';
import { Input } from '@/shared/ui/Input/Input';
import { Flex } from '@/shared/ui/Flex/Flex';

export const CreateWalletWindow = () => {
  const { flow, state } = useCreateWalletWindowLogic();

  return (
    <Window
      zIndex={5004}
      btnText="Create"
      btnIcon={<DepositFillIcon fill="white" width={14} height={14} />}
      btnOnClick={flow.handleCreateWallet}
      isBtnActive={state.isBtnActive}
      isBtnDisabled={state.isLoading}
      isOpen={state.isWindowOpen}
    >
      <NetworkSelect style={{ margin: '12px auto' }} />

      <WindowHeader
        title="Create Wallet"
        isLoading={state.isLoading}
        description={`Create a new ${state.network && networkSymbol[state.network]} wallet`}
      />

      <Flex width="100%" direction="column" gap={12}>
        <Input placeholder="..." label="Wallet name" value={state.walletName} onChange={flow.handleWalletNameChange} />
      </Flex>
    </Window>
  );
};
