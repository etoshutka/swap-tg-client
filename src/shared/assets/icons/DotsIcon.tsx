import React from 'react';

export const DotsIcon = React.forwardRef<any, React.SVGProps<SVGSVGElement>>((props, ref) => {
  return (
    <svg ref={ref} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g id="Icon">
        <g id="Shape">
          <path
            d="M5.11111 11.5C5.11111 12.8807 3.96695 14 2.55556 14C1.14416 14 0 12.8807 0 11.5C0 10.1193 1.14416 9 2.55556 9C3.96695 9 5.11111 10.1193 5.11111 11.5Z"
            fill={props.fill ?? '#A0A0B3'}
          />
          <path
            d="M14.0556 11.5C14.0556 12.8807 12.9114 14 11.5 14C10.0886 14 8.94444 12.8807 8.94444 11.5C8.94444 10.1193 10.0886 9 11.5 9C12.9114 9 14.0556 10.1193 14.0556 11.5Z"
            fill={props.fill ?? '#A0A0B3'}
          />
          <path
            d="M20.4444 14C21.8558 14 23 12.8807 23 11.5C23 10.1193 21.8558 9 20.4444 9C19.0331 9 17.8889 10.1193 17.8889 11.5C17.8889 12.8807 19.0331 14 20.4444 14Z"
            fill={props.fill ?? '#A0A0B3'}
          />
        </g>
      </g>
    </svg>
  );
});
