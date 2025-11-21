// components/EnhancedToolbar.jsx - React 19.2 Enhanced Features
import React, { useCallback } from 'react';
import { useOptimisticUpdates } from '../hooks/useOptimisticUpdates';
import { useNotifications } from '../hooks/useNotifications';
import { useDataCache } from '../hooks/useDataCache';
import NotificationCenter from './NotificationCenter';
import { Plus, Trash2, Download, Upload, Zap, AlertCircle } from 'lucide-react';

/**
 * React 19.2 Enhanced Toolbar with New Features
 * Combines optimistic updates, notifications, and caching
 * Provides smooth UX with instant feedback
 */
export const EnhancedToolbar = ({
  onAddRow,
  onDeleteRow,
  onExport,
  onImport,
  selectedCell,
  data
}) => {
  const { success, error, warning, notifications, removeNotification } = useNotifications();
  const { isPending: cacheLoading, getOrFetch } = useDataCache();
  const { isPending: updatePending, updateOptimistic } = useOptimisticUpdates();

  const handleAddRowOptimistic = useCallback(async () => {
    // Show optimistic update
    success('Row added');

    // Execute actual update
    await updateOptimistic(
      { type: 'add_row' },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        onAddRow?.();
        return { success: true };
      }
    );
  }, [onAddRow, updateOptimistic, success]);

  const handleDeleteRowOptimistic = useCallback(async () => {
    if (!selectedCell) {
      warning('Please select a row first');
      return;
    }

    warning('Row will be deleted', { autoClose: false });

    await updateOptimistic(
      { type: 'delete_row', row: selectedCell.row },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        onDeleteRow?.(selectedCell.row);
        return { success: true };
      }
    );

    success('Row deleted');
  }, [selectedCell, onDeleteRow, updateOptimistic, warning, success]);

  const handleExportOptimistic = useCallback(async () => {
    success('Exporting data...', { autoClose: false });

    await updateOptimistic(
      { type: 'export' },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        onExport?.();
        return { success: true };
      }
    );

    success('Data exported successfully');
  }, [onExport, updateOptimistic, success]);

  const isPending = updatePending || cacheLoading;

  return (
    <>
      <div className="flex items-center space-x-2 p-2">
        <button
          onClick={handleAddRowOptimistic}
          disabled={isPending}
          className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 rounded-lg transition-colors"
          title="Add Row (with optimistic update)"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Add Row</span>
          {isPending && <Zap className="h-3 w-3 animate-spin" />}
        </button>

        <button
          onClick={handleDeleteRowOptimistic}
          disabled={isPending || !selectedCell}
          className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 rounded-lg transition-colors"
          title="Delete Row (with optimistic update)"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm">Delete</span>
          {isPending && <Zap className="h-3 w-3 animate-spin" />}
        </button>

        <button
          onClick={handleExportOptimistic}
          disabled={isPending}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 rounded-lg transition-colors"
          title="Export Data (with caching)"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm">Export</span>
          {isPending && <Zap className="h-3 w-3 animate-spin" />}
        </button>

        <button
          onClick={onImport}
          disabled={isPending}
          className="flex items-center space-x-1 px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-50 rounded-lg transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span className="text-sm">Import</span>
        </button>
      </div>

      <NotificationCenter
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  );
};

export default EnhancedToolbar;
