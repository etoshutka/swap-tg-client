import { Description, TypographyDescriptionProps } from './Description';
import { Title, TypographyTitleProps } from './Title';
import { Text, TypographyTextProps } from './Text';
import React from 'react';

enum TypographyTypes {
  Text = 'Text',
  Title = 'Title',
  Description = 'Description',
}

export interface TypographyProps {
  text: string | React.ReactNode;
  type?: 'secondary';
  block?: boolean;
  width?: React.CSSProperties['width'];
  wrap?: React.CSSProperties['whiteSpace'];
  color?: React.CSSProperties['color'];
  align?: React.CSSProperties['textAlign'];
  weight?: React.CSSProperties['fontWeight'];
  margin?: React.CSSProperties['margin'];
  blockAlign?: React.CSSProperties['alignItems'];
  onClick?: () => void;
  fontSize?: number;
  className?: string;
  transform?: React.CSSProperties['textTransform'];
  overflow?: React.CSSProperties['overflow'];
  textOverflow?: React.CSSProperties['textOverflow'];
  fontFamily?: React.CSSProperties['fontFamily'];
  letterSpacing?: React.CSSProperties['letterSpacing'];
}

type TypographyPropsType = TypographyTextProps | TypographyTitleProps | TypographyDescriptionProps;

export const Typography: Record<TypographyTypes, React.FC<TypographyPropsType>> = {
  Text,
  Title,
  Description,
};
