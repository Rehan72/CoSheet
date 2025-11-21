// components/Toolbar.jsx - Updated with more features
import React from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Undo, 
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  Copy,
  Scissors,
  Clipboard,
  Filter,
  SortAsc
} from 'lucide-react';
import SaveMenu from './SaveMenu';

const Toolbar = ({
  onAddRow,
  onAddColumn,
  onDeleteRow,
  onDeleteColumn,
  onExport,
  onImport,
  onUndo,
  onRedo,
  onClearCell,
  onCopyCell,
  onPasteCell,
  onApplyFormatting,
  onSortData,
  onFilterData,
  canUndo,
  canRedo,
  selectedCell,
   onSaveLocal,
  onSaveJSON,
  onSaveCSV,
  onLoadJSON,
  onClearAll,
  onAutoSaveToggle,
  lastSaved,
  isSaving,
  autoSaveEnabled
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 overflow-x-auto overflow-y-auto max-h-24">
      <div className="flex items-center justify-between w-max">
        <div className="flex items-center space-x-4">
          {/* File Operations */}
          <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
            <button
              onClick={onImport}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
            <button
              onClick={onExport}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Edit Operations */}
          <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                canUndo 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Undo className="h-4 w-4" />
              <span>Undo</span>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                canRedo 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Redo className="h-4 w-4" />
              <span>Redo</span>
            </button>
            <button
              onClick={onCopyCell}
              disabled={!selectedCell}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedCell 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={onPasteCell}
              disabled={!selectedCell}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedCell 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Clipboard className="h-4 w-4" />
              <span>Paste</span>
            </button>
            <button
              onClick={onClearCell}
              disabled={!selectedCell}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedCell 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>

          {/* Structure Operations */}
          <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
            <button
              onClick={onAddRow}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Row</span>
            </button>
            <button
              onClick={onAddColumn}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Column</span>
            </button>
            <button
              onClick={onDeleteRow}
              disabled={!selectedCell}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedCell 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Row</span>
            </button>
            <button
              onClick={onDeleteColumn}
              disabled={!selectedCell}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedCell 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Column</span>
            </button>
          </div>

          {/* Data Operations */}
          <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
            <button
              onClick={() => onSortData(0, true)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <SortAsc className="h-4 w-4" />
              <span>Sort A-Z</span>
            </button>
            <button
              onClick={() => onSortData(0, false)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <SortAsc className="h-4 w-4 rotate-180" />
              <span>Sort Z-A</span>
            </button>
            <button
              onClick={() => onFilterData(0, '')}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Formatting */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => onApplyFormatting('bold')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Bold className="h-4 w-4 text-gray-700" />
            </button>
            <button 
              onClick={() => onApplyFormatting('italic')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Italic className="h-4 w-4 text-gray-700" />
            </button>
            <button 
              onClick={() => onApplyFormatting('underline')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Underline className="h-4 w-4 text-gray-700" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button 
              onClick={() => onApplyFormatting('left')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <AlignLeft className="h-4 w-4 text-gray-700" />
            </button>
            <button 
              onClick={() => onApplyFormatting('center')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <AlignCenter className="h-4 w-4 text-gray-700" />
            </button>
            <button 
              onClick={() => onApplyFormatting('right')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <AlignRight className="h-4 w-4 text-gray-700" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button 
              onClick={() => onApplyFormatting('currency')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <DollarSign className="h-4 w-4 text-gray-700" />
            </button>
            <button 
              onClick={() => onApplyFormatting('percentage')}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Percent className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
     
        {/* Right side tools */}
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            {selectedCell ? `Selected: ${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}` : 'No selection'}
          </div>
           <div className="flex items-center space-x-2">
          {/* Your existing right side tools... */}
          
          <SaveMenu
            onSaveLocal={onSaveLocal}
            onSaveJSON={onSaveJSON}
            onSaveCSV={onSaveCSV}
            onLoadJSON={onLoadJSON}
            onClearAll={onClearAll}
            onAutoSaveToggle={onAutoSaveToggle}
            lastSaved={lastSaved}
            isSaving={isSaving}
            autoSaveEnabled={autoSaveEnabled}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;