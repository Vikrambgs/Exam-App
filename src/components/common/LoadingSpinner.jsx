import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
  );
};

export default LoadingSpinner; 
