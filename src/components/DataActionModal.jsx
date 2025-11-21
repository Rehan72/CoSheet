// components/DataActionModal.jsx - React 19.2 Modal for View/Edit/Export
import React, { useState } from 'react';
import { X, Eye, Edit2, Download, Copy, Mail, Phone, MapPin, Calendar } from 'lucide-react';

/**
 * React 19.2 Data Action Modal Component
 * Displays user data with view, edit, and export functionality
 * Uses smooth transitions for better UX
 */
export const DataActionModal = ({ isOpen, user, onClose, onEdit, onExport }) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(user || {});

  if (!isOpen || !user) return null;

  const handleExport = () => {
    const dataStr = JSON.stringify(editData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editData.name}-data.json`;
    link.click();
    URL.revokeObjectURL(url);
    onExport?.(editData);
  };

  const handleCSVExport = () => {
    const headers = Object.keys(editData).join(',');
    const values = Object.values(editData).map(v => `"${v}"`).join(',');
    const csv = `${headers}\n${values}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editData.name}-data.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onEdit?.(editData);
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editMode ? 'Edit User' : 'View User Details'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {editData.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* View Mode */}
          {!editMode && (
            <div className="space-y-4">
              {/* User Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{editData.name}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-medium text-gray-900">{editData.email}</p>
                    <button
                      onClick={() => handleCopyToClipboard(editData.email)}
                      className="p-1 hover:bg-white rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{editData.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Contact</p>
                      <p className="text-sm font-medium text-gray-900">{editData.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Address</p>
                      <p className="text-sm font-medium text-gray-900">{editData.address}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Join Date</p>
                      <p className="text-sm font-medium text-gray-900">{editData.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 uppercase">Status</p>
                  <p className="text-sm font-medium text-blue-900 mt-1 capitalize">{editData.status}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-semibold text-purple-600 uppercase">Role</p>
                  <p className="text-sm font-medium text-purple-900 mt-1">{editData.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {editMode && (
            <div className="space-y-4">
              {Object.entries(editData).map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 uppercase block mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {key === 'status' ? (
                    <select
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>active</option>
                      <option>pending</option>
                      <option>inactive</option>
                    </select>
                  ) : key === 'role' ? (
                    <select
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Admin</option>
                      <option>User</option>
                      <option>Moderator</option>
                    </select>
                  ) : (
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          {editMode ? (
            <>
              <button
                onClick={() => {
                  setEditMode(false);
                  setEditData(user);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleCSVExport()}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                title="Export as CSV"
              >
                <Download className="h-4 w-4" />
                CSV
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                title="Export as JSON"
              >
                <Download className="h-4 w-4" />
                JSON
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataActionModal;
