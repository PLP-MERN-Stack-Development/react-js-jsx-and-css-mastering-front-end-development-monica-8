import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full p-10">
      {/* Tailwind's animate-spin utility class creates the animation */}
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading posts...</p>
    </div>
  );
};

export default LoadingSpinner;