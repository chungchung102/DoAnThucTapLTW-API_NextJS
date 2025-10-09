'use client';

import { useState, useCallback } from 'react';

export interface AlertConfig {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

export interface ConfirmConfig extends AlertConfig {
  type: 'confirm';
  onConfirm: () => void | Promise<void>;
}

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    config: AlertConfig | null;
    onConfirm?: () => void | Promise<void>;
  }>({
    isOpen: false,
    config: null
  });

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertState({
      isOpen: true,
      config
    });
  }, []);

  const showConfirm = useCallback((config: ConfirmConfig) => {
    setAlertState({
      isOpen: true,
      config: {
        ...config,
        type: 'confirm'
      },
      onConfirm: config.onConfirm
    });
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showAlert({
      title,
      message,
      type: 'success'
    });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string) => {
    showAlert({
      title,
      message,
      type: 'error'
    });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string) => {
    showAlert({
      title,
      message,
      type: 'warning'
    });
  }, [showAlert]);

  const closeAlert = useCallback(() => {
    setAlertState({
      isOpen: false,
      config: null
    });
  }, []);

  // Toast notifications
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success', duration: number = 3000) => {
    const toastClass = type === 'success' ? 'custom-success-toast' : 'custom-error-toast';

    // Create toast element
    const toast = document.createElement('div');
    toast.className = toastClass;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-${type === 'success' ? 'check' : 'times'}-circle"></i>
        <span>${message}</span>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, duration);
  }, []);

  return {
    alertState,
    showAlert,
    showConfirm,
    showSuccess,
    showError,
    showWarning,
    showToast,
    closeAlert
  };
};
