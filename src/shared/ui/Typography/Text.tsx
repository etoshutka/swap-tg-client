import { TypographyProps } from './Typography';
import styles from './Typography.module.scss';
import cn from 'classnames';
import React from 'react';

export type TypographyTextProps = TypographyProps;

export const Text: React.FC<TypographyTextProps> = (props) => {
  const optionsStyles: React.CSSProperties = {
    color: props.color,
    width: props.block ? '100%' : props.width,
    margin: props.margin,
    fontSize: props.fontSize,
    textAlign: props.align,
    whiteSpace: props.wrap,
    fontWeight: props.weight,
    textTransform: props.transform,
    overflow: props.overflow ?? 'hidden',
    textOverflow: props.textOverflow ?? 'ellipsis',
    fontFamily: props.fontFamily,
    letterSpacing: props.letterSpacing,
  };

  const options: Record<string, boolean | undefined> = {
    [styles[props.type ?? '']]: true,
  };

  return (
    <span style={optionsStyles} onClick={props.onClick} className={cn(styles.typography_text, props.className, options)}>
      {props.text}
    </span>
  );
};
