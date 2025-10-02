
import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-500/90',
      icon: <FaCheckCircle className="text-white text-xl" />,
      border: 'border-green-600'
    },
    error: {
      bg: 'bg-red-500/90',
      icon: <FaExclamationCircle className="text-white text-xl" />,
      border: 'border-red-600'
    },
    warning: {
      bg: 'bg-yellow-500/90',
      icon: <FaExclamationCircle className="text-white text-xl" />,
      border: 'border-yellow-600'
    },
    info: {
      bg: 'bg-blue-500/90',
      icon: <FaInfoCircle className="text-white text-xl" />,
      border: 'border-blue-600'
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`fixed top-20 right-4 z-[60] ${currentStyle.bg} ${currentStyle.border} border-2 backdrop-blur-lg rounded-lg shadow-2xl p-4 min-w-[300px] max-w-[400px] animate-slideInRight`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {currentStyle.icon}
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors ml-2"
          aria-label="Close notification"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-white/50 animate-shrinkWidth"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

// Toast Container to manage multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-4 z-[60] space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default Toast;
