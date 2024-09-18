import { MutableRefObject, useCallback, useRef } from 'react';

export function useDebounce(callback: (...params: any[]) => void, delay: number) {
  const timer = useRef() as MutableRefObject<any>;

  return useCallback(
    (...params: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        callback(...params);
      }, delay);
    },
    [callback, delay]
  );
}
