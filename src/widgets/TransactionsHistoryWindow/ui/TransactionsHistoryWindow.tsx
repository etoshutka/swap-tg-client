import { useTransactionsHistoryWindowLogic } from '../lib/hooks/useTransactionsHistoryWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Window } from '@/shared/ui/Window/Window';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Transaction } from './Transaction';

export const TransactionsHistoryWindow = () => {
  const { state } = useTransactionsHistoryWindowLogic();

  return (
    <Window isOpen={state.isWindowOpen}>
      <WindowHeader title="Transactions history" isLoading={state.isLoading} />

      <Flex direction="column" gap={12}>
        {state.transactions.map((t) => (
          <Transaction key={t.id} transaction={t} />
        ))}
      </Flex>
    </Window>
  );
};
