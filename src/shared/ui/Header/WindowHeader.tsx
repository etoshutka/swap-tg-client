import { Typography, TypographyProps } from '@/shared/ui/Typography/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from '@/shared/ui/Spinner/Spinner';
import { Flex } from '@/shared/ui/Flex/Flex';
import React from 'react';

export interface WindowHeaderProps {
  title: React.ReactNode;
  isLoading?: boolean;
  description?: React.ReactNode;
  descriptionType?: TypographyProps['type'];
}

export const WindowHeader: React.FC<WindowHeaderProps> = (props) => {
  return (
    <Flex width="100%" align="center" justify="center" direction="column" padding="16px 16px 32px" gap={4}>
      <Flex width="100%" align="center" justify="center" height="24px">
        {typeof props.title === 'string' ? <Typography.Title text={props.title} fontSize={20} weight={600} blockAlign="center" /> : props.title}
        <AnimatePresence>
          {props.isLoading && (
            <motion.div
              exit={{ width: 0, opacity: 0, paddingLeft: 0 }}
              animate={{ width: 30.6, opacity: 1, paddingLeft: '9px' }}
              initial={{ width: 0, opacity: 0, paddingLeft: 0 }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.6 }}
            >
              <Spinner size="md" />
            </motion.div>
          )}
        </AnimatePresence>
      </Flex>
      {props.description && <Typography.Text text={props.description} type={props.descriptionType} align="center" fontSize={16} weight={400} />}
    </Flex>
  );
};
