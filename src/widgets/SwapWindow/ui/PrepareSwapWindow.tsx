import React, { useState, useCallback } from 'react';
import { UseSwapWindowLogic } from '../lib/hooks/useSwapWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Window } from '@/shared/ui/Window/Window';
import { Button } from '@/shared/ui/Button/Button';
import Image from 'next/image';
import styles from './PrepareSwapWindow.module.scss';
import swapIcon from '@/shared/assets/icons/swap-icon.svg';
import TokenBlock from './TokenBlock';
import TokenInfoBlock from './TokenInfoBlock';
import { getTokenImage } from '@/fsdpages/WalletPage';

interface PrepareSwapWindowProps {
  logic: UseSwapWindowLogic;
}

export const PrepareSwapWindow: React.FC<PrepareSwapWindowProps> = ({ logic }) => {
  const { flow, state } = logic;
  const [showTokenInfo, setShowTokenInfo] = useState(false);

  const handleFromAmountChange = useCallback(flow.handleFromAmountChange, [flow]);

  return (
    <Window 
      isOpen={state.isSwapWindowOpen}
      btnText="Continue"
      btnOnClick={flow.handleOpenConfirmWindow}
      isBtnActive={!state.isSwapButtonDisabled}
      isBtnDisabled={state.isSwapButtonDisabled}
    >
      <div className={styles.swapWindowWrapper}>
        <WindowHeader title="Swap" isLoading={state.isLoading} />
        <div className={styles.content}>
          <TokenBlock 
            isFrom={true}
            token={state.fromToken}
            amount={state.fromAmount}
            usdAmount={state.fromToken ? (Number(state.fromAmount) * (state.fromToken.price || 0)).toFixed(2) : '0.00'}
            onAmountChange={handleFromAmountChange}
            onTokenSelect={flow.handleOpenSelectFromTokenModal}
            onMaxClick={flow.handleMaxButtonClick}
          />
          <div className={styles.swapButtonWrapper}>
            <div className={styles.swapButton} onClick={flow.handleSwapTokens}>
              <Image src={swapIcon} alt='' width={24} height={24} />
            </div>
          </div>
          <TokenBlock 
            isFrom={false}
            token={state.toToken}
            amount={state.toAmount}
            usdAmount={state.toToken ? (Number(state.toAmount) * (state.toToken.price || 0)).toFixed(2) : '0.00'}
            onTokenSelect={flow.handleOpenSelectToTokenModal}
            showTokenInfoButton={!!state.toToken}
            onShowTokenInfo={() => setShowTokenInfo(!showTokenInfo)}
            showTokenInfo={showTokenInfo}
          />
          {showTokenInfo && state.toToken && state.tokenExtendedInfo && (
            <TokenInfoBlock 
              token={state.toToken}
              tokenExtendedInfo={state.tokenExtendedInfo}
              tokenImage={getTokenImage(state.toToken)}
              historicalData={state.historicalData}
            />
          )}
          {state.rate > 0 && state.fromToken && state.toToken && (
            <div className={styles.rate}>
              Best price: 1 {state.fromToken.symbol} ≈ {state.rate.toFixed(6)} {state.toToken.symbol}
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};