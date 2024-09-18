import { SuccessFillIcon } from '@/shared/assets/icons/SuccessFillIcon';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Flex, FlexProps } from '@/shared/ui/Flex/Flex';
import React from 'react';

export type FiledProps = FlexProps & {
  label?: string;
  copyValue?: string;
  onCopyLabel?: string;
};

export const Field = React.forwardRef<any, FiledProps>((props, ref) => {
  const { label, copyValue, onCopyLabel, ...flexProps } = props;
  const { successToast } = useToasts();

  const handleOnCopy = (): void => {
    if (copyValue) {
      navigator.clipboard.writeText(copyValue);
      successToast(onCopyLabel ?? 'Copied', { icon: <SuccessFillIcon width={21} height={21} /> });
    }
    flexProps.onClick && flexProps.onClick();
  };

  return (
    <Flex width="100%" direction="column" gap={10}>
      {label && <Typography.Text text={label} type="secondary" weight={450} />}
      <Flex
        ref={ref}
        width="100%"
        align="center"
        radius="16px"
        padding="10px 16px"
        bg="var(--secondaryBg)"
        {...flexProps}
        style={{
          minHeight: props.height ?? '60px',
        }}
        onClick={handleOnCopy}
      />
    </Flex>
  );
});
