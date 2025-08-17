import React from 'react';
import { Search } from 'lucide-react';

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categoriesWithCounts,
  priceRange,
  setPriceRange,
  selectedBrands,
  toggleBrand,
  brands,
  clearFilters
}) => {
  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Reset
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {categoriesWithCounts.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;