import { globalActions, GlobalWindow } from '@/entities/Global';
import { getSelectedNetwork, Network } from '@/entities/Wallet';
import { networkSymbol } from '@/shared/consts/networkSymbol';
import { Typography } from '@/shared/ui/Typography/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { networkIcons } from '@/shared/consts/networkIcons';
import { Button } from '@/shared/ui/Button/Button';
import Image from 'next/image';
import React from 'react';

export interface NetworkSelectProps {
  style?: React.CSSProperties;
}

export const NetworkSelect: React.FC<NetworkSelectProps> = (props) => {
  const dispatch = useDispatch();
  const selectedNetwork: Network | undefined = useSelector(getSelectedNetwork);

  const handleNetworkClick = async () => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.Networks }));
  };

  return (
    <Button width="fit-content" height={40} onClick={handleNetworkClick} type="inline" style={props.style}>
      <Image width={24} height={24} src={networkIcons[selectedNetwork ?? Network.ETH]} alt="network-icon" />
      <Typography.Text text={networkSymbol[selectedNetwork ?? Network.ETH]} weight={550} />
    </Button>
  );
};
