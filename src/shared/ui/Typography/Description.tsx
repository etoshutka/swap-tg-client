import { TypographyProps } from './Typography';
import styles from './Typography.module.scss';
import cn from 'classnames';
import React from 'react';

export type TypographyDescriptionProps = TypographyProps;

export const Description: React.FC<TypographyDescriptionProps> = (props) => {
  const optionsStyles: React.CSSProperties = {
    color: props.color,
    margin: props.margin,
    fontSize: props.fontSize,
    textAlign: props.align,
    whiteSpace: props.wrap,
    fontWeight: props.weight,
    textTransform: props.transform,
    fontFamily: props.fontFamily,
    letterSpacing: props.letterSpacing,
  };

  const options: Record<string, boolean | undefined> = {
    [styles[props.type ?? '']]: true,
  };

  return (
    <p style={optionsStyles} onClick={props.onClick} className={cn(styles.typography_description, options, props.className)}>
      {props.text}
    </p>
  );
};
