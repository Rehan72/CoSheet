// components/DndProvider.jsx
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

export const DndProvider = ({ 
  children, 
  onRowReorder, 
  onColumnReorder,
  rowItems,
  columnItems 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const activeId = active.id;
      const overId = over.id;

      // Handle row reordering
      if (activeId.startsWith('row-') && overId.startsWith('row-')) {
        const oldIndex = rowItems.findIndex(item => item.id === activeId);
        const newIndex = rowItems.findIndex(item => item.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          onRowReorder(oldIndex, newIndex);
        }
      }

      // Handle column reordering
      if (activeId.startsWith('col-') && overId.startsWith('col-')) {
        const oldIndex = columnItems.findIndex(item => item.id === activeId);
        const newIndex = columnItems.findIndex(item => item.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          onColumnReorder(oldIndex, newIndex);
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};