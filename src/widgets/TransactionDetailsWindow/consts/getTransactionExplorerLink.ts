import { Network } from '@/entities/Wallet';

export const getTransactionExplorerLink = (hash: string, network: Network) => {
  switch (network) {
    case Network.ETH:
      return `https://etherscan.io/tx/${hash}`;
    case Network.BSC:
      return `https://bscscan.com/tx/${hash}`;
    case Network.SOL:
      return `https://solscan.io/tx/${hash}`;
    case Network.TON:
      return `https://tonviewer.com/transaction/${hash}`;
  }
};
