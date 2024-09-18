import { getWindowsOpen, GlobalWindow } from '@/entities/Global';
import { useSelector } from 'react-redux';

export const useSwapWindowLogic = () => {
  const isWindowOpen: boolean = useSelector(getWindowsOpen).some((w) => w.window === GlobalWindow.Swap);

  return {
    flow: {},
    state: {
      isWindowOpen,
    },
  };
};
