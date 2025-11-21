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

import React, { useEffect } from 'react';
import { useDashboardStore } from '../stores';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RefreshCw, Plus } from 'lucide-react';

const Dashboard = () => {
  const { 
    data, 
    stats, 
    loading, 
    error, 
    fetchDashboardData, 
    clearError 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Data
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Data</CardTitle>
          <CardDescription>
            Your latest dashboard data and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available. Click "Add Data" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item, index) => (
                <div 
                  key={item.id || index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title || `Item ${index + 1}`}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description || 'No description available'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {item.value || item.amount || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.date || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
