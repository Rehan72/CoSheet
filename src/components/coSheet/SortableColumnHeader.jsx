// components/SortableColumnHeader.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Search, Plus, Minus } from 'lucide-react';

export const SortableColumnHeader = ({ 
  colIndex, 
  children, 
  isTotalColumn = false,
  collapsedColumns,
  onColumnCollapse,
  searchQuery,
  data 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `col-${colIndex}`,
    disabled: isTotalColumn, // Disable dragging for TOTAL column
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const isCollapsed = collapsedColumns.has(colIndex);
  const hasChildColumns = colIndex < data[0]?.length - 1;

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`w-32 h-8 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 sticky top-0 z-10 group relative ${
        isDragging ? 'shadow-lg bg-blue-50' : ''
      } p-0`}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {!isTotalColumn && (
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-3 w-3 text-gray-500" />
          </button>
        )}
        
        {!isTotalColumn && hasChildColumns && (
          <button
            onClick={() => onColumnCollapse(colIndex)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isCollapsed ? 
              <Plus className="h-3 w-3" /> : 
              <Minus className="h-3 w-3" />
            }
          </button>
        )}
        
        <span>{children}</span>
        
        {searchQuery && data.some(row => 
          row[colIndex]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ) && (
          <Search className="h-3 w-3 text-blue-500 ml-1" />
        )}
      </div>
    </th>
  );
};