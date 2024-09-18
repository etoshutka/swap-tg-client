import { useSwapWindowLogic } from '../lib/hooks/useSwapWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Window } from '@/shared/ui/Window/Window';

export const SwapWindow = () => {
  const { state } = useSwapWindowLogic();

  return (
    <Window isOpen={state.isWindowOpen}>
      <WindowHeader title="Swap" />
    </Window>
  );
};
