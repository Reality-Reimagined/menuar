import { useState, useEffect } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, type = 'success', duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for animation before removing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CircleCheck className="text-green-500" size={20} />;
      case 'error':
        return <CircleAlert className="text-red-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg border ${getBgColor()} transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } max-w-xs z-50`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-3">{getIcon()}</div>
        <div className="text-sm font-medium">{message}</div>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
