import { useNetworksWindowLogic } from '../lib/hooks/useNetworksWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Typography } from '@/shared/ui/Typography/Typography';
import { networkSymbol } from '@/shared/consts/networkSymbol';
import { networkIcons } from '@/shared/consts/networkIcons';
import { Window } from '@/shared/ui/Window/Window';
import styles from './NetworksWindow.module.scss';
import { Flex } from '@/shared/ui/Flex/Flex';
import Image from 'next/image';

export const NetworksWindow = () => {
  const { flow, state } = useNetworksWindowLogic();

  return (
    <Window zIndex={5005} isOpen={state.isWindowOpen}>
      <WindowHeader title="Choose network" isLoading={state.isLoading} />

      <Flex width="100%" direction="column" gap={12}>
        {state.networks.map((n) => (
          <Flex key={n} className={styles.network} onClick={() => flow.handleNetworkClick(n)}>
            {state.selectedNetwork === n && <Flex className={styles.network_selected_pill} />}
            <Image width={40} height={40} src={networkIcons[n]} alt="network-icon" priority />
            <Typography.Text text={`${n} (${networkSymbol[n]})`} fontSize={16} weight={550} />
          </Flex>
        ))}
      </Flex>
    </Window>
  );
};
