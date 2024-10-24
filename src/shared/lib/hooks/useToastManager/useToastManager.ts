import { useState, useCallback, useRef } from 'react';

interface ToastConfig {
  maxCount?: number;
  cooldownPeriod?: number;
}

export const useToastManager = (config: ToastConfig = {}) => {
  const { 
    maxCount = 2, 
    cooldownPeriod = 5000 
  } = config;
  
  const [toastCount, setToastCount] = useState(0);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);
  const lastToastTime = useRef<number>(0);

  const resetToastCount = useCallback(() => {
    setToastCount(0);
    if (cooldownTimer.current) {
      clearTimeout(cooldownTimer.current);
      cooldownTimer.current = null;
    }
  }, []);

  const canShowToast = useCallback(() => {
    const now = Date.now();
    
   
    if (now - lastToastTime.current > cooldownPeriod) {
      resetToastCount();
    }
    
    return toastCount < maxCount;
  }, [toastCount, maxCount, cooldownPeriod]);

  const showToast = useCallback((toastFn: Function, ...args: any[]) => {
    if (canShowToast()) {
      setToastCount(prev => prev + 1);
      lastToastTime.current = Date.now();
      
     
      if (!cooldownTimer.current) {
        cooldownTimer.current = setTimeout(resetToastCount, cooldownPeriod);
      }
      
      return toastFn(...args);
    }
  }, [canShowToast, cooldownPeriod]);

  return { showToast };
};