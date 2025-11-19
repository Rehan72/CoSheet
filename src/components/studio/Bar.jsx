// components/Sidebar.js
import React from 'react';

const Bar = ({ activeSection, setActiveSection, activeSubSection, setActiveSubSection }) => {
  const menuSections = [
    { name: 'Dashboards', subsections: ['Aura-I'] },
    { name: 'Task Manager', subsections: [] },
    { name: 'Bookmarks', subsections: [] },
    { name: 'Document', subsections: [] },
    { name: 'Calendar', subsections: [] },
    { name: 'Architecture', subsections: [] },
    { name: 'Interiors', subsections: [] },
    { name: 'Product', subsections: [] },
    { name: 'Graphics', subsections: [] },
  ];

  const handleSectionClick = (section) => {
    setActiveSection(section.name);
    if (section.subsections.length > 0) {
      setActiveSubSection(section.subsections[0]);
    } else {
      setActiveSubSection(null);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Ant Studio</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuSections.map((section) => (
            <li key={section.name}>
              <button
                onClick={() => handleSectionClick(section)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeSection === section.name
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {section.name}
              </button>

              {/* Sub-sections */}
              {section.subsections.length > 0 && activeSection === section.name && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200">
                  {section.subsections.map((subsection) => (
                    <li key={subsection}>
                      <button
                        onClick={() => setActiveSubSection(subsection)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeSubSection === subsection
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {subsection}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Bar;