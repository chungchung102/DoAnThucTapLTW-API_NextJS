'use client';

import React from 'react';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function CustomAlert({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  onConfirm,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ'
}: CustomAlertProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle text-success"></i>;
      case 'error':
        return <i className="fas fa-times-circle text-danger"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle text-warning"></i>;
      case 'confirm':
        return <i className="fas fa-question-circle text-primary"></i>;
      default:
        return <i className="fas fa-info-circle text-info"></i>;
    }
  };

  const getHeaderClass = () => {
    switch (type) {
      case 'success':
        return 'border-success';
      case 'error':
        return 'border-danger';
      case 'warning':
        return 'border-warning';
      case 'confirm':
        return 'border-primary';
      default:
        return 'border-info';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="custom-alert-backdrop"
      onClick={handleBackdropClick}
    >
      <div className={`custom-alert-modal ${getHeaderClass()}`}>
        <div className="custom-alert-header">
          <div className="custom-alert-icon">
            {getIcon()}
          </div>
          <h5 className="custom-alert-title">{title}</h5>
        </div>

        <div className="custom-alert-body">
          <p className="custom-alert-message">{message}</p>
        </div>

        <div className="custom-alert-footer">
          {type === 'confirm' && onConfirm ? (
            <>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={onClose}
            >
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
