import React from 'react';
import { Filter, Search } from 'lucide-react';

const MobileFilterButton = ({ onClick, hasActiveFilters = false }) => {
  return (
    <button
      onClick={onClick}
      className={`lg:hidden fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
        hasActiveFilters
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 border border-gray-200'
      }`}
      aria-label="Open filters"
    >
      <Filter className="w-5 h-5" />
      <span className="font-medium">Filters</span>
      {hasActiveFilters && (
        <div className="w-2 h-2 bg-white rounded-full" />
      )}
    </button>
  );
};

export default MobileFilterButton;