// components/DashboardView.js - Additional component for better organization
import React from 'react';

export const DashboardAuraI = () => (
  <div className="h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboards</h1>
        <p className="text-gray-600 mt-1">Aura-I</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
        <span>Add a slice</span>
        <span className="text-lg font-bold">+</span>
      </button>
    </div>
    <div className="flex-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-lg font-medium">Aura-I Dashboard</p>
        <p className="text-sm mt-2">Add slices to customize your dashboard view</p>
      </div>
    </div>
  </div>
);

export const ExpandedMenuView = () => (
  <div className="h-full flex flex-col">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboards</h1>
      <p className="text-gray-600 mt-1">Aura-I</p>
    </div>
    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Architecture', 'Interiors', 'Product', 'Graphics'].map((item) => (
          <div key={item} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
            <h3 className="font-semibold text-gray-800">{item}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {item === 'Architecture' && 'Architectural projects and designs'}
              {item === 'Interiors' && 'Interior design projects'}
              {item === 'Product' && 'Product design portfolio'}
              {item === 'Graphics' && 'Graphic design work'}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);