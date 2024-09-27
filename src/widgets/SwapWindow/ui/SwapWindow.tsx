import React from 'react';
import { UseSwapWindowLogic, useSwapWindowLogic } from '../lib/hooks/useSwapWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Window } from '@/shared/ui/Window/Window';
import { PrepareSwapWindow } from './PrepareSwapWindow';
import { ConfirmSwapWindow } from './ConfirmSwapWindow';
import { SelectTokenPage } from './SelectTokenModal';

export const SwapWindow: React.FC = () => {
  const logic: UseSwapWindowLogic = useSwapWindowLogic();
  const { state, flow } = logic;

  const renderContent = () => {
    switch (state.currentView) {
      case 'selectFromToken':
        return (
          <SelectTokenPage
            tokens={state.fromTokens}
            onSelectToken={flow.handleSelectFromToken}
            onBack={flow.handleBackToSwap}
            title="Select token to swap from"
          />
        );
      case 'selectToToken':
        return (
          <SelectTokenPage
            tokens={state.toTokens}
            onSelectToken={flow.handleSelectToToken}
            onBack={flow.handleBackToSwap}
            title="Select token to swap to"
          />
        );
      default:
        return (
          <>
            <PrepareSwapWindow logic={logic} />
            {state.isConfirmSwapWindowOpen && <ConfirmSwapWindow logic={logic} />}
          </>
        );
    }
  };

  return (
    <Window isOpen={state.isSwapWindowOpen}>
      <WindowHeader title="Swap" />
      {renderContent()}
    </Window>
  );
};