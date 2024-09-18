import React from 'react';

export interface ArrowOutlineIconProps extends React.SVGProps<SVGSVGElement> {
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

export const ArrowOutlineIcon = React.forwardRef<any, ArrowOutlineIconProps>((props, ref) => {
  const getRotate = (direction: ArrowOutlineIconProps['direction']) => {
    switch (direction) {
      case 'left':
        return 'rotate(90deg)';
      case 'right':
        return 'rotate(-90deg)';
      case 'top':
        return 'rotate(180deg)';
      case 'bottom':
        return 'rotate(-180deg)';
      default:
        return 'rotate(0deg)';
    }
  };

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
      style={{
        transform: getRotate(props.direction),
        ...props.style,
      }}
    >
      <path
        d="M10.9495 3.18439C11.1856 2.94276 11.5733 2.93799 11.8153 3.17372C12.0573 3.40946 12.0621 3.79644 11.826 4.03807L6.74071 9.24185C6.41006 9.5802 5.86725 9.58681 5.52844 9.25661L0.184571 4.04861C-0.0573886 3.8128 -0.0620587 3.42582 0.17414 3.18426C0.410338 2.9427 0.797962 2.93804 1.03992 3.17385L6.12085 8.12559L10.9495 3.18439Z"
        fill={props.fill ?? '#A0A0B3'}
        stroke={props.fill ?? '#A0A0B3'}
        strokeWidth="0.3"
      />
    </svg>
  );
});
