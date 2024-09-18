import EthIcon from '@/shared/assets/icons/ETHCircleIcon.svg';
import SolIcon from '@/shared/assets/icons/SOLCircleIcon.svg';
import BscIcon from '@/shared/assets/icons/BSCCircleIcon.svg';
import TonIcon from '@/shared/assets/icons/TONCircleIcon.svg';
import { Network } from '@/entities/Wallet';

const domain: string = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://crypto-swap-test.ru';

export const networkIcons: Record<Network, string> = {
  [Network.ETH]: EthIcon,
  [Network.BSC]: BscIcon,
  [Network.SOL]: SolIcon,
  [Network.TON]: TonIcon,
};

export const networkIconsUrl: Record<Network, string> = {
  [Network.ETH]: `${domain}/_next/static/media/ETHCircleIcon.299d64ea.svg`,
  [Network.BSC]: `${domain}/_next/static/media/BSCCircleIcon.5333c467.svg`,
  [Network.SOL]: `${domain}/_next/static/media/SOLCircleIcon.da97ea57.svg`,
  [Network.TON]: `${domain}/_next/static/media/TONCircleIcon.3e8e17a7.svg`,
};
