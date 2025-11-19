// components/MainContent.js
import React from 'react';
import { DashboardAuraI, ExpandedMenuView } from '../../pages/DashboardView';

const MainContent = ({ activeSection, activeSubSection }) => {
  // Render different UIs based on the active section
  const renderContent = () => {
    // Screenshot 1: Dashboards > Aura-I with "Add a slice +" button
    if (activeSection === 'Dashboards' && activeSubSection === 'Aura-I') {
      return <DashboardAuraI />;
    }

    // Screenshot 2: Expanded menu with all sections visible in sidebar
    // This view is mainly controlled by the sidebar state
    if (activeSection === 'Dashboards') {
      return (
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboards</h1>
            <p className="text-gray-600 mt-1">Aura-I</p>
          </div>
          <div className="flex-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">Dashboard Overview</p>
              <p className="text-sm mt-2">Select a dashboard to view details</p>
            </div>
          </div>
        </div>
      );
    }

    // For Architecture, Interiors, Product, Graphics sections
    if (['Architecture', 'Interiors', 'Product', 'Graphics'].includes(activeSection)) {
      return (
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{activeSection}</h1>
            <p className="text-gray-600 mt-1">{activeSection} projects and designs</p>
          </div>
          <div className="flex-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">{activeSection} Portfolio</p>
              <p className="text-sm mt-2">Browse {activeSection.toLowerCase()} projects</p>
            </div>
          </div>
        </div>
      );
    }

    // Screenshot 4: Document & Calendar view
    if (activeSection === 'Document' || activeSection === 'Calendar' || activeSection === 'Task Manager' || activeSection === 'Bookmarks') {
      return (
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{activeSection}</h1>
            <p className="text-gray-600 mt-1">Manage your {activeSection.toLowerCase()}</p>
          </div>
          <div className="flex-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">{activeSection} Content</p>
              <p className="text-sm mt-2">
                {activeSection === 'Document' && 'Documents and files management'}
                {activeSection === 'Calendar' && 'Calendar and scheduling'}
                {activeSection === 'Task Manager' && 'Task management system'}
                {activeSection === 'Bookmarks' && 'Saved bookmarks and links'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default view
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{activeSection}</h1>
          {activeSubSection && <p className="text-gray-600 mt-1">{activeSubSection}</p>}
        </div>
        <div className="flex-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg">{activeSection} Content</p>
            <p className="text-sm mt-2">Working on {activeSection.toLowerCase()} projects</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      {renderContent()}
    </div>
  );
};

export default MainContent;