// hooks/useNotifications.js - React 19.2 Real-time Notifications
import { useState, useCallback, useRef } from 'react';

/**
 * React 19.2 Hook for Real-time Notifications
 * Manages toast/notification queue with auto-dismiss
 * Supports multiple notification types and priorities
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const notificationIdRef = useRef(0);
  const timeoutsRef = useRef(new Map());

  const addNotification = useCallback(
    (message, options = {}) => {
      const {
        type = 'info', // 'success' | 'error' | 'warning' | 'info'
        duration = 3000,
        autoClose = true
      } = options;

      const id = ++notificationIdRef.current;

      setNotifications(prev => [...prev, {
        id,
        message,
        type,
        timestamp: Date.now()
      }]);

      if (autoClose && duration > 0) {
        const timeout = setTimeout(() => {
          removeNotification(id);
        }, duration);

        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // Clear timeout if exists
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  const success = useCallback(
    (message, options) =>
      addNotification(message, { type: 'success', duration: 3000, ...options }),
    [addNotification]
  );

  const error = useCallback(
    (message, options) =>
      addNotification(message, { type: 'error', duration: 5000, ...options }),
    [addNotification]
  );

  const warning = useCallback(
    (message, options) =>
      addNotification(message, { type: 'warning', duration: 4000, ...options }),
    [addNotification]
  );

  const info = useCallback(
    (message, options) =>
      addNotification(message, { type: 'info', duration: 3000, ...options }),
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };
};
