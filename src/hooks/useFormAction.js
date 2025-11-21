// hooks/useFormAction.js - React 19.2 Form Actions
import { useState, useCallback, useTransition } from 'react';

/**
 * React 19.2 Hook for Form Actions
 * Manages form submission with optimistic updates and validation
 * Uses useTransition for non-blocking form processing
 */
export const useFormAction = (onSubmit, onSuccess, onError) => {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});

  const handleSubmit = useCallback(
    (formData) => {
      setErrors({});

      startTransition(async () => {
        try {
          // Convert FormData to object
          const entries = Array.from(formData.entries());
          const formObject = Object.fromEntries(entries);
          
          setData(formObject);

          // Execute submit handler
          const result = await onSubmit(formObject);

          if (result?.success) {
            onSuccess?.(result);
          } else {
            setErrors(result?.errors || {});
            onError?.(result?.message || 'Form submission failed');
          }
        } catch (error) {
          setErrors({ submit: error.message });
          onError?.(error.message);
        }
      });
    },
    [onSubmit, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData({});
    setErrors({});
  }, []);

  return {
    handleSubmit,
    isPending,
    errors,
    data,
    reset,
    setFieldError: (field, error) => {
      setErrors(prev => ({ ...prev, [field]: error }));
    },
    clearFieldError: (field) => {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
};
