// App.jsx (Main Component)
import React, { useState, useCallback, useRef, useEffect } from 'react';
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

function CoSheet() {
    const [showAISidebar, setShowAISidebar] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedRows, setCollapsedRows] = useState(new Set());
  const [collapsedColumns, setCollapsedColumns] = useState(new Set([1]));
  
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
  reorderColumn
  } = useSpreadsheet();

  const { processAICommand, aiThinking, aiResponse } = useAI({ evaluateFormula, getCellValue, data });
  const { users, shareSheet, addComment } = useCollaboration();

  const filteredData = searchQuery ? searchData(searchQuery) : data;

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
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CoSheet</h1>
              <p className="text-sm text-gray-500">Intelligent Spreadsheet</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-white border border-gray-300 rounded-lg px-3 py-1 w-64">
              <Search className="h-4 w-4 text-gray-400 mt-1" />
              <input 
                type="text" 
                placeholder="Search cells..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="ml-2 outline-none bg-transparent w-full"
              />
              {searchQuery && (
                <button 
                  onClick={() => handleSearch('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowCollaboration(!showCollaboration)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showCollaboration 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Collaborate</span>
            </button>
            
            <button
              onClick={() => setShowAISidebar(!showAISidebar)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Brain className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
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
          />

          {/* View Tabs */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-4">
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
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <view.icon className="h-4 w-4 mr-2" />
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spreadsheet Area */}
          <div className="flex-1 overflow-auto bg-white">
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
               searchQuery={searchQuery}
               />
            )}
            {activeView === 'chart' && (
              <ChartView data={data} />
            )}
            {activeView === 'data' && (
              <DataAnalysisView data={data} />
            )}
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
          <AISidebar
            onClose={() => setShowAISidebar(false)}
            onAICommand={processAICommand}
            thinking={aiThinking}
            response={aiResponse}
            data={data}
            selectedCell={selectedCell}
          />
        )}

        {showCollaboration && (
          <CollaborationPanel
            onClose={() => setShowCollaboration(false)}
            users={users}
            onShare={shareSheet}
            onAddComment={addComment}
          />
        )}
      </div>
    </div>
  );
}

export default CoSheet;