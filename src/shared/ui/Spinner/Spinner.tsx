import styles from './Spinner.module.scss';
import classNames from 'classnames';
import React, { FC } from 'react';
import cn from 'classnames';

interface SpinnerProps {
  size?: 'md' | 'lg';
  theme?: 'black';
  center?: boolean;
  className?: string;
}

const Spinner: FC<SpinnerProps> = ({ center = false, size = 'lg', className, ...props }) => {
  const stylesOptions: React.CSSProperties = {
    transform: `scale(${size === 'md' ? 0.8 : 1})`,
  };

  return (
    <div className={classNames(styles.spinner, { [styles.center]: center }, className)} style={stylesOptions}>
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
      <span className={cn(styles.spinner_blade, { [styles.black]: props.theme === 'black' })} />
    </div>
  );
};

export default Spinner;
