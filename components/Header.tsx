
import React from 'react';

const Header = ({ onReset }: { onReset?: () => void }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">Wellness Weaver</h1>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
          >
            Start Over
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
