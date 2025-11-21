import React, { useEffect } from 'react';
import { useUIStore } from '../stores';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from './ui/button';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useUIStore();

  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getTextStyles = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-700 dark:text-green-300';
      case 'error':
        return 'text-red-700 dark:text-red-300';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300';
      default:
        return 'text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className="fixed top-14 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
            max-w-sm animate-in slide-in-from-right duration-300
            ${getStyles(notification.type)}
          `}
        >
          {getIcon(notification.type)}
          
          <div className="flex-1">
            <p className={`text-sm font-medium ${getTextStyles(notification.type)}`}>
              {notification.message}
            </p>
            {notification.description && (
              <p className={`text-xs mt-1 ${getTextStyles(notification.type)} opacity-80`}>
                {notification.description}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={() => removeNotification(notification.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;