'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHeart, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist';
  message: string;
  productName?: string;
}

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

function Toast({ message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hiện toast với animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Tự động ẩn sau 3 giây
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(message.id), 300); // Đợi animation hoàn thành
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message.id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(message.id), 300);
  };

  return (
    <div
      className={`toast-message ${isVisible ? 'show' : ''} ${message.type === 'cart' ? 'toast-cart' : 'toast-wishlist'}`}
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '20px',
        backgroundColor: '#cfe2ff',
        color: '#052c65',
        padding: '12px 16px',
        border: '1px solid #9ec5fe',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        minWidth: '300px',
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >

      <p style={{ flex: 1, maxWidth: '370px' }}>
        <span>Đã đưa </span>
        {message.productName || message.message}
        {message.type === 'cart' ? ' vào giỏ hàng' : ' vào yêu thích'}
      </p>
    </div>
  );
}

// Toast Container để quản lý nhiều toast
interface ToastContainerProps {
  messages: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ messages, onClose }: ToastContainerProps) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      {messages.map((message, index) => (
        <div
          key={message.id}
          style={{
            marginTop: index > 0 ? '10px' : '0'
          }}
        >
          <Toast message={message} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

// Hook để quản lý toast messages
export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = (type: 'cart' | 'wishlist', message: string, productName?: string) => {
    const id = Date.now().toString();
    const newMessage: ToastMessage = {
      id,
      type,
      message,
      productName
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const removeToast = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return {
    messages,
    showToast,
    removeToast
  };
}
