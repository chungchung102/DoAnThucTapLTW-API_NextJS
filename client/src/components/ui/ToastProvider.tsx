'use client';
import React, { createContext, useContext } from 'react';
import { ToastContainer, useToast, ToastMessage } from './Toast';

interface ToastContextType {
  showToast: (type: 'cart' | 'wishlist', message: string, productName?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { messages, showToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer messages={messages} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}
