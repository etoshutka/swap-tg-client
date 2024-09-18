import toastLib, { ToastOptions } from 'react-hot-toast';
import React, { useEffect } from 'react';

const DEFAULT_OPTIONS = {
  style: {
    color: '#fff',
    background: '#333',
    borderRadius: '10px',
  },
};

export const useToasts = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toast = (message: string, options?: ToastOptions) => {
    switch (isOpen) {
      case false:
        setIsOpen(true);
        return toastLib(message, { ...DEFAULT_OPTIONS, ...options });
      case true:
        return () => {};
    }
  };

  const errorToast = (message: string, options?: ToastOptions) => {
    switch (isOpen) {
      case false:
        setIsOpen(true);
        return toastLib.error(message, { ...DEFAULT_OPTIONS, ...options });
      case true:
        return () => {};
    }
  };

  const successToast = (message: string, options?: ToastOptions) => {
    switch (isOpen) {
      case false:
        setIsOpen(true);
        return toastLib.success(message, { ...DEFAULT_OPTIONS, ...options });
      case true:
        return () => {};
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpen) {
      timeout = setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [isOpen]);

  return {
    toast,
    errorToast,
    successToast,
  };
};
