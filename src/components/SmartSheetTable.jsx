import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const columnConfig = [
  { key: "brand", label: "Brand category", bg: "bg-yellow-50" },
  { key: "items", label: "Items", bg: "bg-yellow-50" },
  { key: "spec", label: "Specification", bg: "bg-yellow-50" },

  { key: "code", label: "Code", bg: "bg-red-50" },
  { key: "year", label: "Year", bg: "bg-red-50" },
  { key: "number", label: "Number", bg: "bg-red-50" },

  { key: "net", label: "Net", bg: "bg-blue-50" },
  { key: "unit", label: "Unit", bg: "bg-blue-50" },
  { key: "rate", label: "Rate", bg: "bg-blue-50" },

  { key: "amount", label: "Amount", bg: "bg-green-50" },
  { key: "material", label: "Material", bg: "bg-green-50" },
  { key: "emission", label: "Emission", bg: "bg-green-50" },

  { key: "remarks", label: "AI Remarks", bg: "bg-purple-50" },
];

// Generate unique IDs for each row
const generateId = () => `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Default row data with actual values
const defaultRowData = {
  brand: "concrete",
  items: "flooring",
  spec: "25mm thick cement concrete flooring",
  code: "WBR",
  year: "2014",
  number: "3374-4772-288",
  net: 28920,
  unit: "sq.m",
  rate: 26,
  amount: 268900,
  material: "granite",
  emission: "200-400",
  remarks: "Depends on cement content",
};

const createDefaultRow = () => ({
  id: generateId(),
  ...defaultRowData
});

function SortableRow({ row, updateRow, removeRow }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleInputChange = (key, value) => {
    updateRow(row.id, key, value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[40px_repeat(13,1fr)] border-b hover:bg-gray-50 ${
        isDragging ? "bg-blue-50 shadow-md z-10" : ""
      }`}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="flex justify-center items-center cursor-move text-gray-400 hover:text-black border-l"
      >
        ☰
      </div>

      {columnConfig.map((col) => (
        <div
          key={col.key}
          className={`${col.bg} border-l px-3 py-2`}
        >
          <input
            value={row[col.key] || ""}
            onChange={(e) => handleInputChange(col.key, e.target.value)}
            className="w-full bg-transparent outline-none border-none focus:ring-1 focus:ring-blue-500 rounded px-1"
            placeholder={`Enter ${col.label.toLowerCase()}`}
          />
        </div>
      ))}

      {/* Remove Row */}
      <div className="flex justify-center items-center border-l">
        <button
          onClick={() => removeRow(row.id)}
          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
          title="Remove row"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function SmartSheetTable() {
  const [rows, setRows] = useState([
    createDefaultRow(),
    createDefaultRow(),
    createDefaultRow()
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const updateRow = (rowId, key, value) => {
    setRows(prevRows => 
      prevRows.map(row => 
        row.id === rowId ? { ...row, [key]: value } : row
      )
    );
  };

  const addRow = () => {
    setRows(prevRows => [...prevRows, createDefaultRow()]);
  };

  const removeRow = (rowId) => {
    setRows(prevRows => prevRows.filter(row => row.id !== rowId));
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setRows((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Function to add empty row if needed
  const addEmptyRow = () => {
    const emptyRow = {
      id: generateId(),
      brand: "",
      items: "",
      spec: "",
      code: "",
      year: "",
      number: "",
      net: "",
      unit: "",
      rate: "",
      amount: "",
      material: "",
      emission: "",
      remarks: "",
    };
    setRows(prevRows => [...prevRows, emptyRow]);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Smart Sheet</h2>
        <div className="flex gap-2">
          <button
            onClick={addRow}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Add Row (With Defaults)
          </button>
          <button
            onClick={addEmptyRow}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Add Empty Row
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_repeat(13,1fr)] bg-gray-100 border-b text-xs font-semibold">
          <div className="border-l"></div>
          {columnConfig.map((col) => (
            <div key={col.key} className="px-3 py-3 border-l uppercase tracking-wide text-gray-700">
              {col.label}
            </div>
          ))}
          <div className="border-l"></div>
        </div>

        {/* Draggable Rows */}
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={onDragEnd}
        >
          <SortableContext 
            items={rows.map(row => row.id)} 
            strategy={verticalListSortingStrategy}
          >
            {rows.map((row) => (
              <SortableRow
                key={row.id}
                row={row}
                updateRow={updateRow}
                removeRow={removeRow}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <span>Total Rows: {rows.length}</span>
        <span>Drag the ☰ icon to reorder rows</span>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setRows([createDefaultRow()])}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Reset to One Row
        </button>
        <button
          onClick={() => setRows([])}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}