import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;