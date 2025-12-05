// App.jsx (Main Component) - React 19.2 Features
import React, { useState, useCallback, useRef, useEffect, useDeferredValue, Suspense } from 'react';
import { 
  Calculator, 
  Download, 
  Upload, 
  Brain, 
  Users, 
  History,
  Zap,
  Search,
  BarChart3,
  Filter
} from 'lucide-react';
import SpreadsheetGrid from '../components/coSheet/SpreadsheetGrid';
import Toolbar from '../components/coSheet/Toolbar';
import AISidebar from '../components/coSheet/AISidebar';
import StatusBar from '../components/StatusBar';
import CollaborationPanel from '../components/CollaborationPanel';
import { useSpreadsheet } from '../hooks/useSpreadsheet';
import { useAI } from '../hooks/useAI';
import { useCollaboration } from '../hooks/useCollaboration';
import DataAnalysisView from '../components/DataAnalysisView';
import ChartView from '../components/ChartView';
import ErrorBoundary from '../components/ErrorBoundary';
import { GridLoadingFallback, SidebarLoadingFallback } from '../components/LoadingFallback';
import PerformanceMonitor from '../components/PerformanceMonitor';
import EnhancedToolbar from '../components/EnhancedToolbar';
import NotificationCenter from '../components/NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';

function CoSheet() {
    const [showAISidebar, setShowAISidebar] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedRows, setCollapsedRows] = useState(new Set());
  const [collapsedColumns, setCollapsedColumns] = useState(new Set([1]));
  
  // React 19.2 Notifications for real-time feedback
  const { notifications, removeNotification, success, error } = useNotifications();
  
  // Debug logging
  console.log('AI Sidebar Show:', showAISidebar);
  console.log('Collaboration Show:', showCollaboration);
  
  const {
    data,
    selectedCell,
    formulas,
    history,
    updateCell,
    setSelectedCell,
    addRow,
    addColumn,
    deleteRow,
    deleteColumn,
    undo,
    redo,
    exportToExcel,
    importFromExcel,
    evaluateFormula,
    getCellValue,
    searchData,
    clearCell,
    copyCell,
    pasteCell,
    applyFormatting,
    sortData,
    filterData,
    reorderRow,
  reorderColumn,
  saveToLocalStorage,
  saveAsJSON,
  saveAsCSV,
  loadFromJSON,
  clearAllData,
  setAutoSaveEnabled, // This was missing
  lastSaved,
  isSaving,
  autoSaveEnabled,
  } = useSpreadsheet();

  const { processAICommand, aiThinking, aiResponse } = useAI({ evaluateFormula, getCellValue, data });
  const { users, shareSheet, addComment } = useCollaboration();

  // React 19.2 Feature: useDeferredValue for responsive search - doesn't block UI
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const filteredData = deferredSearchQuery ? searchData(deferredSearchQuery) : data;

  const toggleRowCollapse = (rowIndex) => {
    setCollapsedRows(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(rowIndex)) {
        newCollapsed.delete(rowIndex);
      } else {
        newCollapsed.add(rowIndex);
      }
      return newCollapsed;
    });
  };

  const toggleColumnCollapse = (colIndex) => {
    setCollapsedColumns(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(colIndex)) {
        newCollapsed.delete(colIndex);
      } else {
        newCollapsed.add(colIndex);
      }
      return newCollapsed;
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 w-full overflow-x-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 w-full">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">CoSheet</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent Spreadsheet</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 w-48">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-300 mt-1" />
              <input 
                type="text" 
                placeholder="Search cells..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="ml-2 outline-none bg-transparent w-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => handleSearch('')}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
                >
                  ×
                </button>
              )}
            </div>
            
            <button
              onClick={() => {
                console.log('Collaborate button clicked');
                setShowCollaboration(!showCollaboration);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showCollaboration
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Collaborate</span>
            </button>

            <button
              onClick={() => {
                console.log('AI Assistant button clicked');
                setShowAISidebar(!showAISidebar);
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full min-w-0">
          <Toolbar
            onAddRow={addRow}
            onAddColumn={addColumn}
            onDeleteRow={deleteRow}
            onDeleteColumn={deleteColumn}
            onExport={exportToExcel}
            onImport={importFromExcel}
            onUndo={undo}
            onRedo={redo}
            onClearCell={clearCell}
            onCopyCell={copyCell}
            onPasteCell={pasteCell}
            onApplyFormatting={applyFormatting}
            onSortData={sortData}
            onFilterData={filterData}
            canUndo={history.past.length > 0}
            canRedo={history.future.length > 0}
            selectedCell={selectedCell}
            onSaveLocal={saveToLocalStorage}
            onSaveJSON={saveAsJSON}
            onSaveCSV={saveAsCSV}
            onLoadJSON={loadFromJSON}
            onClearAll={clearAllData}
            onAutoSaveToggle={setAutoSaveEnabled} // This was missing
            lastSaved={lastSaved}
            isSaving={isSaving}
            autoSaveEnabled={autoSaveEnabled}
          />

          {/* View Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
            <div className="flex space-x-4 whitespace-nowrap">
              {[
                { id: 'grid', label: 'Grid', icon: Zap },
                { id: 'chart', label: 'Charts', icon: BarChart3 },
                { id: 'data', label: 'Analysis', icon: Filter }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
                    activeView === view.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <view.icon className="h-4 w-4 mr-2" />
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spreadsheet Area */}
          <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 w-full">
            <ErrorBoundary>
              <Suspense fallback={<GridLoadingFallback />}>
                {activeView === 'grid' && (
                  <SpreadsheetGrid
                   data={filteredData}
                   selectedCell={selectedCell}
                   formulas={formulas}
                   collapsedRows={collapsedRows}
                   collapsedColumns={collapsedColumns}
                   onCellSelect={setSelectedCell}
                   onCellUpdate={updateCell}
                   onFormulaEvaluate={evaluateFormula}
                   onRowCollapse={toggleRowCollapse}
                   onColumnCollapse={toggleColumnCollapse}
                   onRowReorder={reorderRow}
                   onColumnReorder={reorderColumn}
                   searchQuery={deferredSearchQuery}
                   />
                )}
                {activeView === 'chart' && (
                  <ChartView data={data} />
                )}
                {activeView === 'data' && (
                  <DataAnalysisView data={data} />
                )}
              </Suspense>
            </ErrorBoundary>
          </div>

          <StatusBar 
            selectedCell={selectedCell}
            totalRows={data.length}
            totalColumns={data[0]?.length || 0}
            searchResults={searchQuery ? filteredData.flat().filter(cell => 
              cell.toString().toLowerCase().includes(searchQuery.toLowerCase())
            ).length : null}
          />
        </div>

        {/* Sidebars */}
        {showAISidebar && (
          <ErrorBoundary>
            <Suspense fallback={<SidebarLoadingFallback />}>
              <aside className="w-96 h-full bg-white dark:bg-gray-800 border-l-2 border-blue-500 dark:border-blue-400 flex flex-col overflow-hidden shrink-0 z-40 shadow-lg">
                <AISidebar
                  onClose={() => setShowAISidebar(false)}
                  onAICommand={processAICommand}
                  thinking={aiThinking}
                  response={aiResponse}
                  data={data}
                  selectedCell={selectedCell}
                />
              </aside>
            </Suspense>
          </ErrorBoundary>
        )}

        {showCollaboration && !showAISidebar && (
          <ErrorBoundary>
            <Suspense fallback={<SidebarLoadingFallback />}>
              <aside className="w-96 h-full bg-white dark:bg-gray-800 border-l-2 border-purple-500 dark:border-purple-400 flex flex-col overflow-hidden shrink-0 z-40 shadow-lg">
                <CollaborationPanel
                  onClose={() => setShowCollaboration(false)}
                  users={users}
                  onShare={shareSheet}
                  onAddComment={addComment}
                />
              </aside>
            </Suspense>
          </ErrorBoundary>
        )}
      </div>

      {/* React 19.2 Notifications & Performance Monitor */}
      <NotificationCenter
        notifications={notifications}
        onRemove={removeNotification}
      />
      <PerformanceMonitor isDevelopment={true} />
    </div>
  );
}

export default CoSheet;