import { networkNativeTokenIcon } from '@/shared/consts/networkNativeTokenIcon';
import UsdtIcon from '@/shared/assets/icons/USDTCircleIcon.svg';
import { Token } from '@/entities/Wallet';

export const getTokenImage = (token: Token): string => {
  switch (token.symbol) {
    case 'SOL':
    case 'TON':
    case 'BNB':
    case 'ETH':
      return networkNativeTokenIcon[token.symbol];
    case 'USDT':
      return UsdtIcon;
    default:
      return token.icon;
  }
};
