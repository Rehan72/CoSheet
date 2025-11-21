// components/SpreadsheetGrid.jsx - UPDATED WITH DND
import React, { useCallback, useMemo } from 'react';
import { DndProvider } from './DndProvider';
import { SortableRow } from './SortableRow';
import { SortableColumnHeader } from './SortableColumnHeader';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown } from 'lucide-react';
import { Plus } from 'lucide-react';

const SpreadsheetGrid = ({ 
  data, 
  selectedCell, 
  formulas, 
  collapsedRows, 
  collapsedColumns,
  onCellSelect, 
  onCellUpdate, 
  onFormulaEvaluate,
  onRowCollapse,
  onColumnCollapse,
  onRowReorder,
  onColumnReorder,
  searchQuery
}) => {
  const columns = useMemo(() => {
    return data[0] ? Array.from({ length: data[0].length }, (_, i) => i) : [];
  }, [data]);

  // Prepare items for DnD (exclude TOTAL row and column)
  const rowItems = useMemo(() => 
    data.slice(0, -1).map((_, index) => ({ id: `row-${index}` })), 
    [data]
  );

  const columnItems = useMemo(() => 
    columns.slice(0, -1).map((_, index) => ({ id: `col-${index}` })), 
    [columns]
  );

  const getDisplayValue = useCallback((rowIndex, colIndex) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    if (formulas[cellKey]) {
      try {
        return onFormulaEvaluate(formulas[cellKey], data, rowIndex, colIndex);
      } catch (error) {
        return '#ERROR';
      }
    }
    return data[rowIndex]?.[colIndex] || '';
  }, [data, formulas, onFormulaEvaluate]);

  const handleCellClick = (rowIndex, colIndex) => {
    onCellSelect({ row: rowIndex, col: colIndex });
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    onCellUpdate(rowIndex, colIndex, value);
  };

  const getColumnName = (index) => {
    let result = '';
    let i = index;
    do {
      result = String.fromCharCode(65 + (i % 26)) + result;
      i = Math.floor(i / 26) - 1;
    } while (i >= 0);
    return result;
  };

  const highlightSearch = (text) => {
    if (!searchQuery || !text.toString().toLowerCase().includes(searchQuery.toLowerCase())) {
      return text;
    }

    const parts = text.toString().split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() 
        ? <mark key={index} className="bg-yellow-200">{part}</mark> 
        : part
    );
  };

  return (
    <DndProvider
      onRowReorder={onRowReorder}
      onColumnReorder={onColumnReorder}
      rowItems={rowItems}
      columnItems={columnItems}
    >
      <div className="h-full overflow-auto">
        <div className="inline-block min-w-full max-w-screen-xl">
          {/* Column Headers */}
          <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <div className="w-10 sm:w-12 bg-gray-50 border-r border-gray-200 flex items-center justify-center sticky left-0 z-20">
              <button className="p-1 hover:bg-gray-200 rounded">
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <SortableContext items={columnItems} strategy={horizontalListSortingStrategy}>
              {columns.map((colIndex) => {
                const isTotalColumn = colIndex === columns.length - 1;
                
                if (collapsedColumns.has(colIndex)) {
                  return (
                    <div
                      key={colIndex}
                      className="w-8 bg-gray-100 border-r border-gray-200 flex items-center justify-center font-medium text-gray-500 text-sm sticky group relative"
                      style={{ left: 48 + columns.slice(0, colIndex).filter(c => !collapsedColumns.has(c)).length * 128 }}
                    >
                      <button
                        onClick={() => onColumnCollapse(colIndex)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  );
                }

                return (
                  <SortableColumnHeader
                    key={colIndex}
                    colIndex={colIndex}
                    isTotalColumn={isTotalColumn}
                    collapsedColumns={collapsedColumns}
                    onColumnCollapse={onColumnCollapse}
                    searchQuery={searchQuery}
                    data={data}
                  >
                    {getColumnName(colIndex)}
                  </SortableColumnHeader>
                );
              })}
            </SortableContext>
          </div>

          {/* Rows */}
          {data.map((row, rowIndex) => {
            const isTotalRow = rowIndex === data.length - 1;
            
            // Skip rendering if parent row is collapsed
            if (!isRowVisible(rowIndex, collapsedRows)) {
              return null;
            }

            return (
              <SortableRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                isTotalRow={isTotalRow}
                collapsedRows={collapsedRows}
                onRowCollapse={onRowCollapse}
                searchQuery={searchQuery}
              >
                {/* Cells */}
                {columns.map((colIndex) => {
                  const isTotalColumn = colIndex === columns.length - 1;
                  
                  if (collapsedColumns.has(colIndex)) {
                    return (
                      <div
                        key={colIndex}
                        className="w-8 border-r border-b border-gray-200 bg-gray-100 flex items-center justify-center"
                      >
                        <button
                          onClick={() => onColumnCollapse(colIndex)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="h-3 w-3 text-gray-500" />
                        </button>
                      </div>
                    );
                  }

                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                  const displayValue = getDisplayValue(rowIndex, colIndex);
                  const isSearchMatch = searchQuery && 
                    displayValue.toString().toLowerCase().includes(searchQuery.toLowerCase());
                  
                  return (
                    <div
                      key={colIndex}
                      className={`w-32 h-10 border-r border-b border-gray-200 relative ${
                        isSelected
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'bg-white hover:bg-gray-100'
                      } ${isSearchMatch ? 'bg-yellow-50' : ''}`}
                    >
                      <input
                        type="text"
                        value={displayValue}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onFocus={() => handleCellClick(rowIndex, colIndex)}
                        className="w-full h-full px-2 outline-none bg-transparent text-sm"
                        placeholder=""
                      />
                      {isSearchMatch && (
                        <div className="absolute inset-0 border-2 border-yellow-400 pointer-events-none"></div>
                      )}
                    </div>
                  );
                })}
              </SortableRow>
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};

// Helper function to check row visibility
const isRowVisible = (rowIndex, collapsedRows) => {
  let currentRow = rowIndex - 1;
  while (currentRow >= 0) {
    if (collapsedRows.has(currentRow)) {
      return false;
    }
    currentRow--;
  }
  return true;
};

export default SpreadsheetGrid;