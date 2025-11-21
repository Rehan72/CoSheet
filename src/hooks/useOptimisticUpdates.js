// hooks/useOptimisticUpdates.js - React 19.2 Optimistic Updates
import { useState, useCallback, useTransition } from 'react';

/**
 * React 19.2 Hook for Optimistic Updates
 * Provides instant UI feedback while async operations complete
 * Uses useTransition to manage pending states smoothly
 */
export const useOptimisticUpdates = (onUpdate) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useState(null);
  const [error, setError] = useState(null);

  const updateOptimistic = useCallback(
    async (newValue, asyncOperation) => {
      try {
        // Immediately update UI (optimistic)
        setOptimisticState(newValue);
        setError(null);

        // Execute async operation in transition
        startTransition(async () => {
          try {
            // Wait for server response
            const result = await asyncOperation();
            
            // Confirm the update
            if (onUpdate) {
              onUpdate(result);
            }
            setOptimisticState(null);
          } catch (err) {
            // Revert on error
            setOptimisticState(null);
            setError(err.message);
            console.error('Optimistic update failed:', err);
          }
        });
      } catch (err) {
        setError(err.message);
      }
    },
    [onUpdate]
  );

  return {
    isPending,
    optimisticState,
    error,
    updateOptimistic,
    clearError: () => setError(null)
  };
};
