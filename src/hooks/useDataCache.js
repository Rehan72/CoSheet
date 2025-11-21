// hooks/useDataCache.js - React 19.2 Data Caching with Transitions
import { useState, useCallback, useTransition, useRef } from 'react';

/**
 * React 19.2 Hook for Smart Data Caching
 * Caches API responses and manages cache invalidation
 * Uses useTransition for non-blocking updates
 */
export const useDataCache = () => {
  const cacheRef = useRef(new Map());
  const [isPending, startTransition] = useTransition();
  const [cachedData, setCachedData] = useState({});
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    size: 0
  });

  const getOrFetch = useCallback(
    async (key, fetchFn, options = {}) => {
      const { ttl = 5 * 60 * 1000, forceRefresh = false } = options;
      
      // Check cache
      if (!forceRefresh && cacheRef.current.has(key)) {
        const cached = cacheRef.current.get(key);
        
        // Check if expired
        if (Date.now() - cached.timestamp < ttl) {
          setCacheStats(prev => ({
            ...prev,
            hits: prev.hits + 1
          }));
          return cached.data;
        }
      }

      // Cache miss - fetch new data
      setCacheStats(prev => ({
        ...prev,
        misses: prev.misses + 1
      }));

      return new Promise((resolve) => {
        startTransition(async () => {
          try {
            const data = await fetchFn();
            
            // Store in cache
            cacheRef.current.set(key, {
              data,
              timestamp: Date.now()
            });

            // Update state
            setCachedData(prev => ({
              ...prev,
              [key]: data
            }));

            setCacheStats(prev => ({
              ...prev,
              size: cacheRef.current.size
            }));

            resolve(data);
          } catch (error) {
            console.error('Cache fetch error:', error);
            resolve(null);
          }
        });
      });
    },
    []
  );

  const invalidate = useCallback((key) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
    
    setCacheStats(prev => ({
      ...prev,
      size: cacheRef.current.size
    }));
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    setCachedData({});
    setCacheStats({
      hits: 0,
      misses: 0,
      size: 0
    });
  }, []);

  return {
    getOrFetch,
    invalidate,
    clearCache,
    cachedData,
    cacheStats,
    isPending
  };
};
