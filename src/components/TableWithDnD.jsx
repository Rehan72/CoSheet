import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sample initial data
const initialData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Manager', status: 'Inactive' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Developer', status: 'Active' },
];

// Sortable Row Component
function SortableRow({ item, index, onRemove, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Role badge color
  const getRoleColor = (role) => {
    switch (role) {
      case 'Developer':
        return 'bg-blue-100 text-blue-800';
      case 'Designer':
        return 'bg-purple-100 text-purple-800';
      case 'Manager':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200 ${
        isDragging
          ? 'bg-blue-50 dark:bg-blue-900/50 shadow-md z-10'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <div className="col-span-1 flex items-center text-gray-500 dark:text-gray-400">
        <div
          {...listeners}
          {...attributes}
          className="cursor-move mr-2 text-gray-400 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
        {index + 1}
      </div>
      <div className="col-span-3 font-medium text-gray-900 dark:text-white">
        {item.name}
      </div>
      <div className="col-span-3 text-gray-600 dark:text-gray-300">
        {item.email}
      </div>
      <div className="col-span-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
            item.role
          )}`}
        >
          {item.role}
        </span>
      </div>
      <div className="col-span-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            item.status
          )}`}
        >
          {item.status}
        </span>
      </div>
      <div className="col-span-1">
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

const TableWithDnD = () => {
  const [items, setItems] = useState(initialData);
  const [newItem, setNewItem] = useState({
    name: '',
    email: '',
    role: 'Developer',
    status: 'Active'
  });

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag and drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Add new item
  const handleAddItem = () => {
    if (!newItem.name || !newItem.email) return;

    const item = {
      id: Date.now().toString(),
      ...newItem
    };

    setItems([...items, item]);
    setNewItem({
      name: '',
      email: '',
      role: 'Developer',
      status: 'Active'
    });
  };

  // Remove item
  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Handle input change for new item
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Drag and drop to reorder users</p>
      </div>

      {/* Add New Item Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Add New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={newItem.name}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={newItem.email}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            name="role"
            value={newItem.role}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
          <select
            name="status"
            value={newItem.status}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button
          onClick={handleAddItem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-200">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Rows */}
            {items.map((item, index) => (
              <SortableRow
                key={item.id}
                item={item}
                index={index}
                onRemove={handleRemoveItem}
                isDragging={activeId === item.id}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No users found</p>
            <p className="text-gray-400 dark:text-gray-500">Add a new user to get started</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Total Users: {items.length} | 
        Active: {items.filter(item => item.status === 'Active').length} | 
        Inactive: {items.filter(item => item.status === 'Inactive').length}
      </div>
    </div>
  );
};

export default TableWithDnD;