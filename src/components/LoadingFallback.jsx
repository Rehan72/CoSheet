// components/LoadingFallback.jsx - React 19.2 Suspense Fallback
import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingFallback = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-16 h-16">
        <Loader className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
      <p className="text-lg font-medium text-gray-700">{message}</p>
      <p className="text-sm text-gray-500">Please wait...</p>
    </div>
  </div>
);

export const GridLoadingFallback = () => (
  <div className="flex items-center justify-center h-full bg-white">
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-12 h-12">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
      <p className="text-gray-600">Loading spreadsheet...</p>
    </div>
  </div>
);

export const SidebarLoadingFallback = () => (
  <div className="w-96 h-full bg-white border-l border-gray-200 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-2">
      <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);
