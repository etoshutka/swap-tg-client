import { Transaction as TransactionInterface } from '@/entities/Wallet';
import { transactionTypeLabel } from '../consts/transactionTypeLabel';
import { transactionTypeIcon } from '../consts/transactionTypeIcon';
import { globalActions, GlobalWindow } from '@/entities/Global';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Field } from '@/shared/ui/Field/Field';
import { Flex } from '@/shared/ui/Flex/Flex';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import React from 'react';

export interface TransactionProps {
  transaction: TransactionInterface;
}

export const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  const dispatch = useDispatch();
  const createdAtLocalTime: moment.Moment = moment.tz(transaction.created_at, 'UTC').tz(moment.tz.guess());

  const handleTransactionClick = () => {
    dispatch(globalActions.addWindow({ window: GlobalWindow.TransactionDetails, payload: transaction }));
  };

  return (
    <Field justify="space-between" onClick={handleTransactionClick}>
      <Flex align="center" gap={12}>
        {transactionTypeIcon[transaction.type]}
        <Flex direction="column">
          <Typography.Text text={transactionTypeLabel[transaction.type]} fontSize={16} weight={550} />
          <Typography.Text text={createdAtLocalTime.format('D MMMM, HH:mm')} type="secondary" />
        </Flex>
      </Flex>

      <Flex direction="column">
        <Typography.Text text={`${transaction.amount.toFixed(2)} ${transaction.currency}`} fontSize={16} weight={550} align="right" />
        <Typography.Text text={`≈ ${transaction.amount_usd.toFixed(2)} $`} type="secondary" align="right" />
      </Flex>
    </Field>
  );
};
