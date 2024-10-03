import React, { memo } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/Button/Button';
import { getTokenImage } from '@/fsdpages/WalletPage';
import styles from './PrepareSwapWindow.module.scss';
import arrowIcon from '@/shared/assets/icons/arrow-icon.svg';
import { Token } from '@/entities/Wallet';

interface TokenBlockProps {
  isFrom: boolean;
  token?: Token;
  amount: string;
  usdAmount: string;
  onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTokenSelect: () => void;
  onMaxClick?: () => void;
  showTokenInfoButton?: boolean;
  onShowTokenInfo?: () => void;
  showTokenInfo?: boolean;
}

const TokenBlock: React.FC<TokenBlockProps> = ({
  isFrom,
  token,
  amount,
  usdAmount,
  onAmountChange,
  onTokenSelect,
  onMaxClick,
  showTokenInfoButton,
  onShowTokenInfo,
  showTokenInfo,
}) => {
  return (
    <div className={styles.tokenBlock}>
      <div className={styles.label}>{isFrom ? "You give" : "You receive"}</div>
      <div className={styles.tokenInfo}>
        <div className={styles.amountInfo}>
          <input
            id={isFrom ? "fromAmount" : "toAmount"}
            name={isFrom ? "fromAmount" : "toAmount"}
            type="number"
            value={amount}
            onChange={onAmountChange}
            placeholder="0"
            className={styles.amountInput}
            readOnly={!isFrom}
          />
          <div className={styles.usdAmount}>{usdAmount} $</div>
        </div>
        <div className={styles.tokenSelector} onClick={onTokenSelect}>
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
            <Image src={arrowIcon} alt='' width={24} height={24} />
          </span>
        </div>
      </div>
      <div className={styles.balance}>
        {token ? `${token.balance.toFixed(2)} ${token.symbol}` : 'Select a token'}
      </div>
      <div className={styles.buttonContainer}>
        {isFrom && (
          <div className={styles.percentButtons}>
            {['25%', '50%', '75%', 'Max'].map((percent, index) => (
              <Button
                key={percent}
                onClick={() => {
                  if (index === 3 && onMaxClick) {
                    onMaxClick();
                  } else if (onAmountChange) {
                    const newAmount = (token ? (token.balance * (index + 1) * 0.25).toFixed(6) : '0');
                    onAmountChange({ target: { value: newAmount } } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                className={styles.percentButton}
              >
                {percent}
              </Button>
            ))}
          </div>
        )}
        {showTokenInfoButton && (
          <Button 
            onClick={onShowTokenInfo}
            className={styles.tokenInfoButton}
          >
            {showTokenInfo ? 'Hide' : 'Show'} Info
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(TokenBlock);