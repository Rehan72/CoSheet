// components/DataAnalysisView.jsx
import React, { useMemo, useState } from 'react';
import { Filter, SortAsc, SortDesc, Download, BarChart3 } from 'lucide-react';

const DataAnalysisView = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});

  const analysisData = useMemo(() => {
    if (!data || data.length < 2) return [];

    const headers = data[0];
    const rows = data.slice(1, -1); // Exclude total row

    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
  }, [data]);

  const statistics = useMemo(() => {
    if (analysisData.length === 0) return {};

    const numericColumns = data[0]?.filter((header, index) => {
      return analysisData.some(row => !isNaN(parseFloat(row[header])));
    }) || [];

    const stats = {};
    
    numericColumns.forEach(column => {
      const values = analysisData.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
      if (values.length > 0) {
        stats[column] = {
          sum: values.reduce((a, b) => a + b, 0),
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    });

    return stats;
  }, [analysisData, data]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return analysisData;

    return [...analysisData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [analysisData, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return row[key]?.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [sortedData, filters]);

  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  if (analysisData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>No data available for analysis</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Data Analysis</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statistics).map(([column, stats]) => (
          <div key={column} className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">{column}</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Avg:</span>
                <span className="font-medium">${stats.average.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">${stats.sum.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Range:</span>
                <span className="font-medium">${stats.min}-${stats.max}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {data[0]?.map((header, index) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <span>{header}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleSort(header)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <SortAsc className="h-3 w-3" />
                        </button>
                        <div className="relative">
                          <Filter className="h-3 w-3 cursor-pointer" />
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={filters[header] || ''}
                            onChange={(e) => handleFilterChange(header, e.target.value)}
                            className="absolute left-0 top-6 w-32 p-1 text-xs border border-gray-300 rounded opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {data[0]?.map(header => (
                    <td key={header} className="px-4 py-2 text-sm text-gray-900">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredData.length} of {analysisData.length} records
        {Object.keys(filters).length > 0 && ' (filtered)'}
      </div>
    </div>
  );
};

export default DataAnalysisView;