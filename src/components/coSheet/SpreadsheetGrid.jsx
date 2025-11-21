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
    const value = data[rowIndex]?.[colIndex] || '';
    return String(value).trim(); // Ensure we're returning string
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
      <div className="w-full h-full overflow-auto bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0 z-10 bg-gray-50">
              <th className="w-12 h-8 bg-gray-50 border border-gray-200 text-center text-xs font-medium text-gray-600">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <ChevronDown className="h-4 w-4 text-gray-600 mx-auto" />
                </button>
              </th>
              {columns.map((colIndex) => {
                const isTotalColumn = colIndex === columns.length - 1;
                
                if (collapsedColumns.has(colIndex)) {
                  return (
                    <th
                      key={colIndex}
                      className="w-8 h-8 bg-gray-100 border border-gray-200 text-center"
                    >
                      <button
                        onClick={() => onColumnCollapse(colIndex)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="h-3 w-3 mx-auto" />
                      </button>
                    </th>
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
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const isTotalRow = rowIndex === data.length - 1;
              
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
                        <td
                          key={colIndex}
                          className="w-8 h-10 border border-gray-200 bg-gray-100 text-center"
                        >
                          <button
                            onClick={() => onColumnCollapse(colIndex)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="h-3 w-3 text-gray-500 mx-auto" />
                          </button>
                        </td>
                      );
                    }

                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                    const displayValue = getDisplayValue(rowIndex, colIndex);
                    const isSearchMatch = searchQuery && 
                      displayValue.toString().toLowerCase().includes(searchQuery.toLowerCase());
                    
                    return (
                      <td
                        key={colIndex}
                        className={`w-32 h-10 border border-gray-200 relative p-0 ${
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
                          className="w-full h-full px-2 py-1 outline-none bg-transparent text-sm text-gray-900 placeholder-gray-300"
                          placeholder=""
                        />
                        {isSearchMatch && (
                          <div className="absolute inset-0 border-2 border-yellow-400 pointer-events-none"></div>
                        )}
                      </td>
                    );
                  })}
                </SortableRow>
              );
            })}
          </tbody>
        </table>
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