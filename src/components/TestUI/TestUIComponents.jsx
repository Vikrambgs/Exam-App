import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const TestUIComponents = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">UI Components Test Page</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Buttons</h2>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Primary
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            Secondary
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Danger
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Basic Card</h3>
            <p className="text-gray-600 dark:text-gray-400">Simple card with basic styling</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Hover Card</h3>
            <p className="text-gray-600 dark:text-gray-400">Card with hover effect</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Interactive Card</h3>
            <p className="text-gray-600 dark:text-gray-400">Clickable card with transitions</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading States</h2>
        <div className="space-y-4">
          <LoadingSpinner />
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full w-1/2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Form Elements</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Text Input
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">Checkbox</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestUIComponents; 
