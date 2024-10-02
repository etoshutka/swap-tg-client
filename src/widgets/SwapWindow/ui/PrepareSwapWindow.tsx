import React from 'react';
import { UseSwapWindowLogic } from '../lib/hooks/useSwapWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { getTokenImage } from '@/fsdpages/WalletPage';
import { Window } from '@/shared/ui/Window/Window';
import { Button } from '@/shared/ui/Button/Button';
import Image from 'next/image';
import styles from './PrepareSwapWindow.module.scss';
import swapIcon from '@/shared/assets/icons/swap-icon.svg'
import arrowIcon from '@/shared/assets/icons/arrow-icon.svg'
import { Input } from '@/shared/ui/Input/Input';

interface PrepareSwapWindowProps {
  logic: UseSwapWindowLogic;
}

export const PrepareSwapWindow: React.FC<PrepareSwapWindowProps> = ({ logic }) => {
  const { flow, state } = logic;

  const TokenBlock = ({ isFrom }: { isFrom: boolean }) => {
    const token = isFrom ? state.fromToken : state.toToken;
    const amount = isFrom ? state.fromAmount : state.toAmount;
    const usdAmount = isFrom
      ? (Number(state.fromAmount) * (state.fromToken?.price || 0)).toFixed(2)
      : (Number(state.toAmount) * (state.toToken?.price || 0)).toFixed(2);

    return (
      <div className={styles.tokenBlock}>
        <div className={styles.label}>{isFrom ? "You give" : "You receive"}</div>
        <div className={styles.tokenInfo}>
          <div className={styles.amountInfo}>
            <Input
               id="fromAmount"
               name="fromAmount"
               type="number"
               value={amount}
               onChange={flow.handleFromAmountChange}
               placeholder="0"
               className={styles.amountInput}
               readonly={!isFrom}
            />
            <div className={styles.usdAmount}>{usdAmount} $</div>
          </div>
          <div className={styles.tokenSelector} onClick={isFrom ? flow.handleOpenSelectFromTokenModal : flow.handleOpenSelectToTokenModal}>
            {token && (
              <Image 
                src={getTokenImage(token)} 
                alt={`${token.symbol} icon`} 
                width={24} 
                height={24} 
              />
            )}
            <span>{token ? token.symbol : "Token"}</span>
            <span className={styles.arrow}>
                <Image src={arrowIcon.src} alt='' />
            </span>
          </div>
        </div>
        <div className={styles.balance}>
          {isFrom ? `${token?.balance?.toFixed(2) || '0.00'} ${token?.symbol || ''}` : `${token?.balance?.toFixed(2) || '0.00'} ${token?.symbol || ''}`}
        </div>
        {isFrom && (
          <div className={styles.percentButtons}>
            {['25%', '50%', '75%', 'Max'].map((percent, index) => (
              <Button
                key={percent}
                onClick={() => {
                  if (index === 3) {
                    flow.handleMaxButtonClick();
                  } else {
                    const amount = state.fromToken ? (state.fromToken.balance * (index + 1) * 0.25).toFixed(6) : '0';
                    flow.handleFromAmountChange({ target: { value: amount } } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                className={styles.percentButton}
              >
                {percent}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

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
          <TokenBlock isFrom={true} />
          <div className={styles.swapButtonWrapper}>
            <div className={styles.swapButton} onClick={flow.handleSwapTokens}>
            <Image src={swapIcon.src} alt='' />
            </div>
          </div>
          <TokenBlock isFrom={false} />
          {state.rate > 0 && (
            <div className={styles.rate}>
              Best price: 1 {state.fromToken?.symbol} = {state.rate.toFixed(6)} {state.toToken?.symbol}
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};