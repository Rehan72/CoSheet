// components/CollaborationPanel.jsx
import React, { useState } from 'react';
import { X, UserPlus, MessageCircle, Mail, Shield } from 'lucide-react';

const CollaborationPanel = ({ onClose, users, onShare, onAddComment }) => {
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');

  const handleShare = (e) => {
    e.preventDefault();
    if (shareEmail) {
      onShare(shareEmail, sharePermission);
      setShareEmail('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {console.log('CollaborationPanel rendering')}
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Collaboration</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Share Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Share this sheet</h3>
        <form onSubmit={handleShare} className="space-y-3">
          <div>
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            {['view', 'comment', 'edit'].map((permission) => (
              <button
                key={permission}
                type="button"
                onClick={() => setSharePermission(permission)}
                className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors capitalize ${
                  sharePermission === permission
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {permission}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            Share
          </button>
        </form>
      </div>

      {/* Active Users */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          People with access ({users.length})
        </h3>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <Shield className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex-1 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Comments</h3>
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                A
              </div>
              <span className="text-xs font-medium text-gray-900">Alex Chen</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <p className="text-sm text-gray-700">
              Can we get the Q1 numbers for the new product line?
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
                Y
              </div>
              <span className="text-xs font-medium text-gray-900">You</span>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <p className="text-sm text-gray-700">
              I'll add them by EOD today.
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;