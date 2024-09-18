import { CloseInlineIcon } from '@/shared/assets/icons/CloseInlineIcon';
import { Flex } from '@/shared/ui/Flex/Flex';
import styles from './Input.module.scss';
import cn from 'classnames';
import React from 'react';

export interface InputProps {
  id?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  icon?: React.ReactNode;
  value?: string;
  label?: string;
  name?: string;
  block?: boolean;
  theme?: 'light' | 'dark';
  readonly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  size?: 'lg' | 'sm';
  className?: string;
  variant?: 'inline';
  onMaxButtonClick?: () => void;
  isHasMaxButton?: boolean;
}

export const Input: React.FC<InputProps> = (props) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const options: Record<string, boolean | undefined> = {
    [styles.block]: props.block,
    [styles[props.theme ?? 'light']]: true,
    [styles.focused]: isFocused,
    [styles.readonly]: props.readonly,
    [styles.hasIcon]: !!props.icon,
    [styles.lg]: props.size === 'lg',
    [styles.sm]: props.size === 'sm',
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleClearClick = () => {
    props.value && props.onChange && props.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={cn(styles.input_wrapper, options)}>
      {props.label && (
        <label htmlFor={props.id} className={styles.label}>
          {props.label}
        </label>
      )}

      <Flex width="inherit" height="fit-content" gap={0} className={cn(styles.input_container, props.className)}>
        {props.icon && props.icon}

        <input
          id={props.id}
          ref={inputRef}
          type={props.type}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={props.placeholder}
          className={styles.input}
        />

        {props.value && <CloseInlineIcon width={18.5} height={18.5} onClick={handleClearClick} />}

        {props.isHasMaxButton && !props.value && (
          <Flex onClick={props.onMaxButtonClick} className={styles.max_btn}>
            Max
          </Flex>
        )}
      </Flex>
    </div>
  );
};
