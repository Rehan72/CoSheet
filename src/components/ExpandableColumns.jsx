// components/ExpandableColumns.js
import React, { useState } from 'react';

const ExpandableColumns = () => {
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const columns = [
    {
      id: 1,
      title: "Architecture",
      description: "Architectural designs and projects",
      collapsedText: "Arch",
      icon: "🏛️"
    },
    {
      id: 2,
      title: "Interiors",
      description: "Interior design projects",
      collapsedText: "Int",
      icon: "🛋️"
    },
    {
      id: 3,
      title: "Product",
      description: "Product design portfolio",
      collapsedText: "Prod",
      icon: "📱"
    },
    {
      id: 4,
      title: "Graphics",
      description: "Graphic design work",
      collapsedText: "Graph",
      icon: "🎨"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ant Studio</h1>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Dashboards</h2>
          <div className="mt-2">
            <h3 className="text-md font-medium text-gray-700">Aura-I</h3>
          </div>
        </div>
      </div>

      {/* Add slice button */}
      <div className="flex justify-start mb-8">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
          <span>Add a slice</span>
          <span className="text-lg font-bold">+</span>
        </button>
      </div>

      {/* Expandable Columns Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-4 gap-4 h-64">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`relative bg-white border-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${
                hoveredColumn === column.id
                  ? 'border-blue-500 shadow-lg col-span-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onMouseEnter={() => setHoveredColumn(column.id)}
              onMouseLeave={() => setHoveredColumn(null)}
            >
              {/* Collapsed State */}
              <div className={`p-4 h-full flex flex-col items-center justify-center transition-opacity duration-300 ${
                hoveredColumn === column.id ? 'opacity-0 absolute inset-0' : 'opacity-100'
              }`}>
                <div className="text-2xl mb-2">{column.icon}</div>
                <div className="text-sm font-medium text-gray-700 text-center">
                  {column.collapsedText}
                </div>
              </div>

              {/* Expanded State */}
              <div className={`p-6 h-full flex flex-col transition-opacity duration-300 ${
                hoveredColumn === column.id ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{column.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800">{column.title}</h3>
                </div>
                <p className="text-gray-600 text-sm flex-1">
                  {column.description}
                </p>
                <div className="mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpandableColumns;