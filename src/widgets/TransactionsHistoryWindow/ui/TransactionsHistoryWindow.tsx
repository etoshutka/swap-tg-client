import { useTransactionsHistoryWindowLogic } from '../lib/hooks/useTransactionsHistoryWindowLogic';
import { WindowHeader } from '@/shared/ui/Header/WindowHeader';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Window } from '@/shared/ui/Window/Window';
import { Flex } from '@/shared/ui/Flex/Flex';
import { Transaction } from './Transaction';
import Image from 'next/image';
import notrans from '@/shared/assets/icons/notransicon.svg';

export const TransactionsHistoryWindow = () => {
  const { state } = useTransactionsHistoryWindowLogic();

  return (
    <Window isOpen={state.isWindowOpen}>
      <WindowHeader title="Transactions history" isLoading={state.isLoading} />

      <Flex direction="column" gap={12}>
        {!state.isLoading && state.transactions.length === 0 ? (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            style={{ 
              padding: '20px',
              minHeight: '400px', 
              height: '100%'     
            }}
          >
            <Image 
              src={notrans} 
              alt="No transactions" 
              width={120}       
              height={120}      
              style={{
                marginBottom: '16px' 
              }}
            />
            <Typography.Text 
              text="No transactions found" 
              type="secondary" 
              align="center"
              fontSize={16}     
            />
          </Flex>
        ) : (
          state.transactions.map((t) => (
            <Transaction key={t.id} transaction={t} />
          ))
        )}
      </Flex>
    </Window>
  );
};