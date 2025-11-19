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
    <div
      ref={setNodeRef}
      style={style}
      className={`w-32 h-8 bg-gray-50 border-r border-gray-200 flex items-center justify-center font-medium text-gray-700 text-sm sticky group relative ${
        isDragging ? 'shadow-lg bg-blue-50' : ''
      }`}
    >
      {!isTotalColumn && (
        <button
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity absolute left-1"
        >
          <GripVertical className="h-3 w-3 text-gray-500" />
        </button>
      )}
      
      {!isTotalColumn && hasChildColumns && (
        <button
          onClick={() => onColumnCollapse(colIndex)}
          className="p-1 hover:bg-gray-200 rounded absolute left-6"
        >
          {isCollapsed ? 
            <Plus className="h-3 w-3" /> : 
            <Minus className="h-3 w-3" />
          }
        </button>
      )}
      
      <span className={!isTotalColumn ? 'ml-10' : 'ml-2'}>{children}</span>
      
      {searchQuery && data.some(row => 
        row[colIndex]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) && (
        <Search className="h-3 w-3 text-blue-500 absolute right-2" />
      )}
    </div>
  );
};