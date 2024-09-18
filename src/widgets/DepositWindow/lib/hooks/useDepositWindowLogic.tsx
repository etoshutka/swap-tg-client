import { getSelectedNetwork, getSelectedWallet, Network, Wallet } from '@/entities/Wallet';
import { SuccessFillIcon } from '@/shared/assets/icons/SuccessFillIcon';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { getIsWindowOpen, GlobalWindow } from '@/entities/Global';
import { useSelector } from 'react-redux';

export const useDepositWindowLogic = () => {
  const { successToast } = useToasts();

  const selectedNetwork: Network | undefined = useSelector(getSelectedNetwork);
  const selectedWallet: Wallet | undefined = useSelector(getSelectedWallet);
  const isWindowOpen: boolean = useSelector(getIsWindowOpen)(GlobalWindow.Deposit);

  const handleCopyAddress = () => {
    if (!selectedWallet) return;
    navigator.clipboard.writeText(selectedWallet.address);
    successToast('Copied', { icon: <SuccessFillIcon width={21} height={21} /> });
  };

  return {
    flow: {
      handleCopyAddress,
    },
    state: {
      isWindowOpen,
      network: selectedNetwork,
      depositAddress: selectedWallet?.address,
    },
  };
};
