import { Typography, TypographyProps } from './Typography';
import styles from './Typography.module.scss';
import { Flex } from '@/shared/ui/Flex/Flex';
import cn from 'classnames';
import React from 'react';

export type TypographyTitleProps = TypographyProps & {
  gap?: number;
  level?: 1 | 2 | 3 | 4;
  subtitle?: React.ReactNode;
  direction?: 'row' | 'column';
};

export const Title: React.FC<TypographyTitleProps> = (props) => {
  // Динамический тег заголовка
  const HeaderHtmlTag = `h${props.level ?? 1}` as keyof React.JSX.IntrinsicElements;

  const optionsStyles: React.CSSProperties = {
    color: props.color,
    width: props.block ? '100%' : 'auto',
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

  const GAP = props.gap ?? 3;
  const DIRECTION = props.direction ?? 'column';
  const BLOCK_ALIGN = props.blockAlign ?? 'flex-start';

  return (
    <>
      {props.subtitle ? (
        <Flex width="100%" justify="center" align={BLOCK_ALIGN} direction={DIRECTION} gap={GAP}>
          <HeaderHtmlTag style={optionsStyles} onClick={props.onClick} className={cn(styles.typography_title, options, props.className)}>
            {props.text}
          </HeaderHtmlTag>
          {typeof props.subtitle === 'string' ? (
            <Typography.Text text={props.subtitle} type="secondary" weight="400" align="left" className={cn(styles.typography_subtitle)} />
          ) : (
            props.subtitle
          )}
        </Flex>
      ) : (
        <HeaderHtmlTag style={optionsStyles} onClick={props.onClick} className={cn(styles.typography_title, options, props.className)}>
          {props.text}
        </HeaderHtmlTag>
      )}
    </>
  );
};
