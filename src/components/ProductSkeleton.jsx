import React from 'react';

const ProductSkeleton = ({ count = 8, viewMode = 'grid' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {skeletons.map((index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex gap-6">
              {/* Image Skeleton */}
              <div className="w-32 h-32 bg-gray-200 rounded-xl flex-shrink-0"></div>
              
              {/* Content Skeleton */}
              <div className="flex-1 space-y-4">
                {/* Brand and Title */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                
                {/* Rating and Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view skeletons
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skeletons.map((index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="relative">
            <div className="w-full h-48 bg-gray-200"></div>
            {/* Discount Badge Skeleton */}
            <div className="absolute top-3 left-3 w-12 h-6 bg-gray-300 rounded-full"></div>
            {/* Wishlist Button Skeleton */}
            <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Brand */}
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            
            {/* Weight */}
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            {/* Description */}
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            {/* Features */}
            <div className="flex gap-1">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
            
            {/* Price */}
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-28"></div>
            </div>
            
            {/* Stock */}
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            
            {/* Add to Cart Button */}
            <div className="h-10 bg-gray-200 rounded-full w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Category Filter Skeleton
export const CategoryFilterSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="h-10 bg-gray-200 rounded-full w-20 animate-pulse"></div>
      ))}
    </div>
  );
};

// Search and Filter Skeleton
export const SearchFilterSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div className="lg:col-span-1">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-full w-full"></div>
        </div>
        
        {/* Brand Filter */}
        <div className="lg:col-span-1">
          <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="lg:col-span-1">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
        
        {/* Sort */}
        <div className="lg:col-span-1">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;