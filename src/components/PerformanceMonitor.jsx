// components/PerformanceMonitor.jsx - React 19.2 Performance Metrics
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Zap, Clock } from 'lucide-react';

/**
 * React 19.2 Performance Monitor Component
 * Real-time performance metrics using Web Performance API
 * Displays render times, memory usage, and interaction metrics
 */
export const PerformanceMonitor = ({ isDevelopment = false }) => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    fps: 0,
    memoryUsage: 0,
    lastInteractionTime: 0
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isDevelopment) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;

        // Get memory usage if available
        const memoryUsage = performance.memory
          ? Math.round(performance.memory.usedJSHeapSize / 1048576)
          : 0;

        // Get navigation timing
        if (performance.timing) {
          const renderTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          
          setMetrics(prev => ({
            ...prev,
            renderTime,
            fps,
            memoryUsage
          }));
        }
      }

      requestAnimationFrame(measureFrame);
    };

    const animationId = requestAnimationFrame(measureFrame);
    return () => cancelAnimationFrame(animationId);
  }, [isDevelopment]);

  // Track user interactions
  useEffect(() => {
    const handleInteraction = () => {
      setMetrics(prev => ({
        ...prev,
        lastInteractionTime: performance.now()
      }));
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  if (!isDevelopment) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Zap className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-gray-900 text-white rounded-lg shadow-xl p-4 w-64 text-sm font-mono">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-400" />
              <span>FPS: <span className="text-green-400">{metrics.fps}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>Render: <span className="text-blue-400">{metrics.renderTime}ms</span></span>
            </div>
            {metrics.memoryUsage > 0 && (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Memory: <span className="text-yellow-400">{metrics.memoryUsage}MB</span></span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
