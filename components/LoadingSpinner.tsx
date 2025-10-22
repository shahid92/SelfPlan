
import React from 'react';

const LoadingSpinner = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="text-indigo-700 font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
