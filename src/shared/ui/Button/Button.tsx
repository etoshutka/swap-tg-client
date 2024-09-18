'use client';

import { useRouter } from 'next/navigation';
import styles from './Button.module.scss';
import cn from 'classnames';
import React from 'react';

export interface ButtonProps {
  text?: string | React.ReactNode;
  icon?: React.ReactNode;
  type?: 'primary' | 'default' | 'text' | 'inline';
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  style?: React.CSSProperties;
  href?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  padding?: React.CSSProperties['padding'];
  block?: boolean;
  children?: React.ReactNode;
  className?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  direction?: React.CSSProperties['flexDirection'];
}

export const Button: React.FC<ButtonProps> = (props) => {
  const router = useRouter();

  const options: Record<string, boolean | undefined> = {
    [styles.block]: props.block,
    [styles.disabled]: props.disabled,
    [styles[props.type ?? 'default']]: true,
  };

  const optionsStyles: React.CSSProperties = {
    width: props.width,
    height: props.height,
    padding: props.padding,
    minHeight: props.height,
    flexDirection: props.direction,
    ...props.style,
  };

  const handleButtonClick = () => {
    props.onClick && props.onClick();
    props.href && router.push(props.href);
  };

  return (
    <button
      type={props.htmlType}
      style={optionsStyles}
      onClick={handleButtonClick}
      disabled={props.disabled}
      className={cn(styles.button, props.className, options)}
    >
      {props.icon && props.icon}
      {props.text ? props.text : props.children}
    </button>
  );
};
