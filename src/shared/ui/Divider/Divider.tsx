import styles from './Divider.module.scss';
import cn from 'classnames';
import React from 'react';

export interface DividerProps {
  width?: React.CSSProperties['width'];
  border?: React.CSSProperties['border'];
  margin?: React.CSSProperties['margin'];
  className?: string;
}

export const Divider: React.FC<DividerProps> = (props) => {
  const style: React.CSSProperties = {
    width: props.width,
    border: props.border,
    margin: props.margin,
  };

  return <div style={style} className={cn(styles.divider, props.className)} />;
};
