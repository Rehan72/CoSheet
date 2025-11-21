// components/SortableRow.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Minus, Search } from 'lucide-react';

export const SortableRow = ({ 
  row, 
  rowIndex, 
  children, 
  isTotalRow = false,
  collapsedRows,
  onRowCollapse,
  searchQuery 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `row-${rowIndex}`,
    disabled: isTotalRow, // Disable dragging for TOTAL row
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const level = getRowCollapseLevel(row[0]);
  const isCollapsed = collapsedRows.has(rowIndex);
  const hasChildRows = rowIndex < row.length - 1 && row[rowIndex + 1]?.[0]?.startsWith('  ');

  return (
    <tr 
      ref={setNodeRef} 
      style={style}
      className={`hover:bg-gray-50 group ${isDragging ? 'shadow-lg opacity-50' : ''}`}
    >
      {/* Row Header with Drag Handle */}
      <td 
        className="w-12 h-10 bg-gray-50 border border-gray-200 text-sm text-gray-600 font-medium sticky left-0 z-10 group relative p-0"
        style={{ paddingLeft: `${level * 12}px` }}
      >
        <div className="flex items-center justify-center h-full">
          {!isTotalRow && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-3 w-3 text-gray-500" />
            </button>
          )}
          
          {!isTotalRow && hasChildRows && (
            <button
              onClick={() => onRowCollapse(rowIndex)}
              className="p-1 hover:bg-gray-200 rounded ml-1"
            >
              {isCollapsed ? 
                <Plus className="h-3 w-3" /> : 
                <Minus className="h-3 w-3" />
              }
            </button>
          )}
          
          <span className="ml-1 text-xs">{rowIndex + 1}</span>
          
          {searchQuery && row.some(cell => 
            cell.toString().toLowerCase().includes(searchQuery.toLowerCase())
          ) && (
            <Search className="h-3 w-3 text-blue-500 ml-auto mr-1" />
          )}
        </div>
      </td>

      {/* Row Cells */}
      {children}
    </tr>
  );
};

// Helper function
const getRowCollapseLevel = (firstCell) => {
  const match = (firstCell || '').match(/^(\s+)/);
  return match ? match[1].length : 0;
};