// components/AISidebar.jsx
import React, { useState } from 'react';
import { X, Send, Brain, Zap, Lightbulb, Calculator } from 'lucide-react';

const AISidebar = ({ onClose, onAICommand, thinking, response, data }) => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { type: 'user', content: prompt };
    setConversation(prev => [...prev, userMessage]);
    setPrompt('');

    const aiResponse = await onAICommand(prompt);
    const aiMessage = { type: 'assistant', content: aiResponse };
    setConversation(prev => [...prev, aiMessage]);
  };

  const quickActions = [
    {
      icon: <Calculator className="h-4 w-4" />,
      title: 'Calculate Totals',
      prompt: 'Calculate the sum of all numerical values in the first column'
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: 'Find Patterns',
      prompt: 'Identify any patterns or trends in the data'
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      title: 'Data Insights',
      prompt: 'Provide insights and recommendations based on the current data'
    },
    {
      icon: <Brain className="h-4 w-4" />,
      title: 'Clean Data',
      prompt: 'Help me clean and format the data for better analysis'
    }
  ];

  return (
    <div className="w-80 sm:w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 rounded-lg">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setPrompt(action.prompt)}
              className="flex items-center space-x-2 p-2 text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-left"
            >
              {action.icon}
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-50 border border-blue-100 ml-8' 
                : 'bg-gray-50 border border-gray-100 mr-8'
            }`}
          >
            <p className="text-sm text-gray-800">{message.content}</p>
          </div>
        ))}
        {thinking && (
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 mr-8">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-600">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to analyze your data..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || thinking}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AISidebar;