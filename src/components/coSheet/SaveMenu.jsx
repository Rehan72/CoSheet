// components/SaveMenu.jsx - UPDATED
import React, { useState, useRef } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  HardDrive, 
  FileText, 
  FileSpreadsheet,
  Trash2,
  Settings,
  CheckCircle,
  Clock
} from 'lucide-react';

const SaveMenu = ({ 
  onSaveLocal,
  onSaveJSON,
  onSaveCSV,
  onLoadJSON,
  onClearAll,
  onAutoSaveToggle, // Make this optional
  lastSaved,
  isSaving,
  autoSaveEnabled = true // Default value
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleLoadJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && onLoadJSON) {
      onLoadJSON(file);
    }
    event.target.value = ''; // Reset input
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never saved';
    
    // Handle both Date objects and strings
    const savedDate = lastSaved instanceof Date ? lastSaved : new Date(lastSaved);
    const now = new Date();
    const diffMs = now - savedDate;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return savedDate.toLocaleDateString();
  };

  // Safe function calls
  const handleSaveLocal = () => {
    if (onSaveLocal) {
      onSaveLocal();
      setIsOpen(false);
    }
  };

  const handleSaveJSON = () => {
    if (onSaveJSON) {
      onSaveJSON();
      setIsOpen(false);
    }
  };

  const handleSaveCSV = () => {
    if (onSaveCSV) {
      onSaveCSV();
      setIsOpen(false);
    }
  };

  const handleClearAll = () => {
    if (onClearAll && window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      onClearAll();
      setIsOpen(false);
    }
  };

  const handleAutoSaveToggle = (enabled) => {
    if (onAutoSaveToggle) {
      onAutoSaveToggle(enabled);
    }
  };

  return (
    <div className="relative">
      {/* Save Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        disabled={isSaving}
      >
        {isSaving ? (
          <Clock className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span>Save</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Save Options</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {isSaving ? (
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 animate-spin mr-1" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    {formatLastSaved()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Save Options */}
          <div className="p-2 space-y-1">
            {/* Auto-save Toggle - Only show if function exists */}
            {onAutoSaveToggle && (
              <button
                onClick={() => handleAutoSaveToggle(!autoSaveEnabled)}
                className="flex items-center space-x-3 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="flex-1">Auto-save</span>
                <div className={`w-8 h-4 rounded-full transition-colors ${
                  autoSaveEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    autoSaveEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </button>
            )}

            {/* Save to Browser */}
            <button
              onClick={handleSaveLocal}
              disabled={!onSaveLocal}
              className={`flex items-center space-x-3 w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                onSaveLocal 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <HardDrive className="h-4 w-4 text-blue-500" />
              <span>Save to Browser</span>
            </button>

            {/* Save as JSON */}
            <button
              onClick={handleSaveJSON}
              disabled={!onSaveJSON}
              className={`flex items-center space-x-3 w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                onSaveJSON 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <FileText className="h-4 w-4 text-purple-500" />
              <span>Save as JSON</span>
            </button>

            {/* Save as CSV */}
            <button
              onClick={handleSaveCSV}
              disabled={!onSaveCSV}
              className={`flex items-center space-x-3 w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                onSaveCSV 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4 text-green-500" />
              <span>Save as CSV</span>
            </button>

            {/* Load from JSON */}
            <button
              onClick={handleLoadJSON}
              disabled={!onLoadJSON}
              className={`flex items-center space-x-3 w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                onLoadJSON 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Upload className="h-4 w-4 text-orange-500" />
              <span>Load from JSON</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200 my-1"></div>

            {/* Clear All */}
            <button
              onClick={handleClearAll}
              disabled={!onClearAll}
              className={`flex items-center space-x-3 w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                onClearAll 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".json"
        className="hidden"
      />

      {/* Close menu when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SaveMenu;