import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
      <div className="relative w-full max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search for algorithms, patterns or tips..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
    </div>
  );
};

export default SearchBar;