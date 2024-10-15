import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Window } from '@/shared/ui/Window/Window';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Button } from '@/shared/ui/Button/Button';
import { Typography } from '@/shared/ui/Typography/Typography';
import { getTokenImage } from '../../lib/helpers/getTokenImage';
import { Token, getSelectedToken, walletActions } from '@/entities/Wallet';
import { globalActions, GlobalWindow, getIsWindowOpen } from '@/entities/Global';
import { useSwapWindowLogic } from '@/widgets/SwapWindow/lib/hooks/useSwapWindowLogic';
import { useTransferWindowLogic } from '@/widgets/TransferWindow/lib/hooks/useTransferWindowLogic';
import { useDepositWindowLogic } from '@/widgets/DepositWindow/lib/hooks/useDepositWindowLogic';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { DepositFillIcon } from '@/shared/assets/icons/DepositFillIcon';
import { SendFillIcon } from '@/shared/assets/icons/SendFillIcon';
import { SwapFillIcon } from '@/shared/assets/icons/SwapFillIcon';
import Image from 'next/image';
import { StateSchema } from '@/shared/lib/providers/StoreProvider';

export const TokenDetailsWindow: React.FC = () => {
  const dispatch = useDispatch();
  const swapLogic = useSwapWindowLogic();
  const transferLogic = useTransferWindowLogic();
  const { errorToast } = useToasts();

  const [localToken, setLocalToken] = useState<Token | null>(null);
  const selectedToken = useSelector(getSelectedToken);
  const isWindowOpen = useSelector((state: StateSchema) => getIsWindowOpen(state)(GlobalWindow.TokenDetails));

  useEffect(() => {
    if (selectedToken) {
      setLocalToken(selectedToken);
    }
  }, [selectedToken]);

  const handleClose = useCallback(() => {
    dispatch(globalActions.removeWindow(GlobalWindow.TokenDetails));
    dispatch(walletActions.clearSelectedToken());
  }, [dispatch]);

  const handleDeposit = useCallback(() => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.Deposit }));
    setTimeout(handleClose, 100);
  }, [dispatch, handleClose]);

  const handleSend = useCallback(() => {
    if (localToken && localToken.balance <= 0) {
      errorToast('Insufficient funds');
      return;
    }
    if (localToken) {
      dispatch(walletActions.setSelectedToken(localToken));
      dispatch(globalActions.addWindow({ window: GlobalWindow.Transfer }));
      transferLogic.flow.handleTokenSelect(localToken);
      setTimeout(handleClose, 100);
    }
  }, [localToken, dispatch, errorToast, transferLogic.flow, handleClose]);

  const handleSwap = useCallback(() => {
    if (localToken && localToken.balance <= 0) {
      errorToast('Insufficient funds');
      return;
    }
    if (localToken) {
      dispatch(walletActions.setSelectedToken(localToken));
      dispatch(globalActions.addWindow({ window: GlobalWindow.Swap }));
      swapLogic.flow.handleSelectFromToken(localToken);
      setTimeout(handleClose, 100);
    }
  }, [localToken, dispatch, errorToast, swapLogic.flow, handleClose]);

  if (!localToken) {
    return null;
  }

  return (
    <Window isOpen={isWindowOpen} onClose={handleClose}>
      <Flex direction="column" align="center" gap={16}>
        <Image width={64} height={64} src={getTokenImage(localToken)} alt={`${localToken.name} icon`} />
        <Flex align="baseline" gap={4}>
          <Typography.Text text={`${localToken.balance.toFixed(2)}`} fontFamily="ClashDisplay-Bold" fontSize={40} />
          <Typography.Text text={localToken.symbol} fontFamily="ClashDisplay-Bold" fontSize={40} type="secondary" />
        </Flex>
        <Typography.Text text={`≈ ${localToken.balance_usd.toFixed(2)} $`} type="secondary" />
        
        <Flex gap={8} align="center" justify="center">
          <Button width={100} padding="12px 8px" direction="column" onClick={handleDeposit}>
            <DepositFillIcon />
            <Typography.Text text="Deposit" weight="450" color="var(--accent)" fontSize={14} />
          </Button>
          <Button 
            width={100} 
            padding="12px 8px" 
            direction="column" 
            onClick={handleSend}
          >
            <SendFillIcon />
            <Typography.Text text="Send" weight="450" color="var(--accent)" fontSize={14} />
          </Button>
          <Button 
            width={100} 
            padding="12px 8px" 
            direction="column" 
            onClick={handleSwap}
          >
            <SwapFillIcon />
            <Typography.Text text="Swap" weight="450" color="var(--accent)" fontSize={14} />
          </Button>
        </Flex>

        <div style={{ width: '100%', height: '1px', backgroundColor: '#d3d3d3', margin: '16px 0' }} />

        <Flex direction="column" width="100%" gap={8}>
          <Typography.Text text="Transaction History" weight={600} />
          <Flex direction="column" align="center" justify="center" style={{ padding: '20px' }}>
            <Typography.Text text=" " type="secondary" align="center" />
          </Flex>
        </Flex>
      </Flex>
    </Window>
  );
};