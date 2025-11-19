// components/StatusBar.jsx - Updated with search results
import React from 'react';
import { Save, Wifi, Battery, Search } from 'lucide-react';

const StatusBar = ({ selectedCell, totalRows, totalColumns, searchResults }) => {
  const getCellAddress = () => {
    if (!selectedCell) return 'No cell selected';
    
    const columnName = String.fromCharCode(65 + selectedCell.col);
    return `${columnName}${selectedCell.row + 1}`;
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Save className="h-3 w-3 text-green-500" />
          <span>All changes saved</span>
        </div>
        
        <div>
          <span>Cell: {getCellAddress()}</span>
        </div>
        
        <div>
          <span>Rows: {totalRows} | Columns: {totalColumns}</span>
        </div>

        {searchResults !== null && (
          <div className="flex items-center space-x-2">
            <Search className="h-3 w-3 text-blue-500" />
            <span>{searchResults} matches found</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Wifi className="h-3 w-3" />
          <span>Online</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Battery className="h-3 w-3" />
          <span>100%</span>
        </div>
        
        <div>
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;