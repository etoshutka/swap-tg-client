import React, { useState, useCallback } from 'react';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import Image from 'next/image';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { walletApi, Network, Token } from '@/entities/Wallet';
import { useSelector } from 'react-redux';
import { getSelectedWallet } from '@/entities/Wallet';
import { Window } from '@/shared/ui/Window/Window';
import { useSwapWindowLogic } from '../lib/hooks/useSwapWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';

interface SelectTokenPageProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  onBack: () => void;
  title: string;
}

export const SelectTokenPage: React.FC<SelectTokenPageProps> = ({
  tokens,
  onSelectToken,
  onBack,
  title,
}) => {
  const { state } = useSwapWindowLogic();
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getTokenInfoRequest] = walletApi.useLazyGetTokenInfoQuery();
  const selectedWallet = useSelector(getSelectedWallet);

  const handleGetTokenInfo = useDebounce(async (address: string) => {
    if (!address || !selectedWallet) return;
    setIsLoading(true);
    try {
      const result = await getTokenInfoRequest({
        network: selectedWallet.network,
        contract: address,
      }).unwrap();
      
      if (result.data) {
        const currentDate = new Date().toISOString();
        const newToken: Token = {
          id: result.data.contract,
          wallet_id: selectedWallet.id,
          symbol: result.data.symbol,
          network: selectedWallet.network,
          name: result.data.name,
          contract: address,
          balance: 0,
          balance_usd: 0,
          price: result.data.price,
          price_change_percentage: result.data.price_change_percentage || 0,
          icon: result.data.icon || '',
          added_at: currentDate,
          updated_at: currentDate,
        };
        onSelectToken(newToken);
      }
    } catch (e) {
      console.error('Failed to get token info', e);
    } finally {
      setIsLoading(false);
    }
  }, 350);

  const handleTokenAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokenAddress(value);
    if (value) {
      handleGetTokenInfo(value);
    }
  }, [handleGetTokenInfo]);

  return (
    <Window isOpen={state.isSwapWindowOpen}>
    <WindowHeader title={title} isLoading={state.isLoading} />
    <Flex direction="column" gap={12}>
      <Button 
        onClick={onBack} 
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '20px',
          backgroundColor: 'rgba(233, 237, 242, 1)',
          justifyContent: 'center',
        }}
      >
        <Typography.Text text="Back to Swap" />
      </Button>
      
      <Input
        label={`Enter ${selectedWallet?.network || ''} token contract address`}
        placeholder="0x..."
        value={tokenAddress}
        onChange={handleTokenAddressChange}
      />

      
      {tokens.map((token) => (
        <Button
          key={token.id}
          onClick={() => onSelectToken(token)}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            padding: '12px',
            borderRadius: '12px',
          }}
        >
          <Flex align="center" gap={12} style={{ width: '100%' }}>
            <Image src={token.icon} alt={token.symbol} width={32} height={32} />
            <Flex direction="column" align="flex-start">
              <Typography.Text text={token.symbol} weight="bold" />
              <Typography.Text text={token.name} type="secondary" />
            </Flex>
            <Flex direction="column" align="flex-end" style={{ marginLeft: 'auto' }}>
              <Typography.Text text={`${token.balance.toFixed(4)} ${token.symbol}`} />
              <Typography.Text text={`$${token.balance_usd.toFixed(2)}`} type="secondary" />
            </Flex>
          </Flex>
        </Button>
      ))}
    </Flex>
    </Window>
  );
};