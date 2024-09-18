import { getWindowsOpen, globalActions, GlobalWindow } from '@/entities/Global';
import { useDispatch, useSelector } from 'react-redux';

export const useAddWalletWindowLogic = () => {
  const dispatch = useDispatch();

  const isWindowOpen: boolean = useSelector(getWindowsOpen).some((w) => w.window === GlobalWindow.AddWallet);

  const handleCreateWalletClick = () => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.CreateWallet }));
  };

  const handleImportWalletClick = () => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.ImportWallet }));
  };

  return {
    flow: {
      handleCreateWalletClick,
      handleImportWalletClick,
    },
    state: {
      isWindowOpen,
    },
  };
};
