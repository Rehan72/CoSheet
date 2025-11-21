// components/NotificationCenter.jsx - React 19.2 Notification UI Component
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * React 19.2 Notification Center Component
 * Displays real-time notifications with smooth animations
 * Uses Tailwind CSS for responsive design
 */
export const NotificationCenter = ({ notifications, onRemove }) => {
  const getIcon = (type) => {
    const iconProps = "h-5 w-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconProps} text-green-500`} />;
      case 'error':
        return <AlertCircle className={`${iconProps} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconProps} text-yellow-500`} />;
      case 'info':
      default:
        return <Info className={`${iconProps} text-blue-500`} />;
    }
  };

  const getStyles = (type) => {
    const baseStyles = "p-4 rounded-lg border shadow-lg flex items-center gap-3 animate-slide-in";
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={getStyles(notification.type)}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          <button
            onClick={() => onRemove(notification.id)}
            className="p-1 hover:bg-white/50 rounded-md transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
