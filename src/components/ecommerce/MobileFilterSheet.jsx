import React, { useState, useEffect } from 'react';
import { X, Filter, Search, DollarSign, Tag } from 'lucide-react';

const MobileFilterSheet = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  brands,
  selectedBrands,
  onBrandChange,
  onApplyFilters,
  onResetFilters
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [localSelectedBrands, setLocalSelectedBrands] = useState(selectedBrands);

  // Update local state when props change
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
    setLocalSelectedCategory(selectedCategory);
    setLocalPriceRange(priceRange);
    setLocalSelectedBrands(selectedBrands);
  }, [searchTerm, selectedCategory, priceRange, selectedBrands]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleApply = () => {
    onSearchChange(localSearchTerm);
    onCategoryChange(localSelectedCategory);
    onPriceRangeChange(localPriceRange);
    onBrandChange(localSelectedBrands);
    onApplyFilters();
    onClose();
  };

  const handleReset = () => {
    setLocalSearchTerm('');
    setLocalSelectedCategory('');
    setLocalPriceRange([0, 1000]);
    setLocalSelectedBrands([]);
    onResetFilters();
  };

  const handleBrandToggle = (brand) => {
    setLocalSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 transform transition-transform duration-300 ease-out max-h-[85vh] overflow-hidden ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Search */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Search className="w-4 h-4" />
              Search Products
            </label>
            <input
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>
          
          {/* Categories */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setLocalSelectedCategory('')}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  localSelectedCategory === ''
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setLocalSelectedCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    localSelectedCategory === category
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <DollarSign className="w-4 h-4" />
              Price Range
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                  <input
                    type="number"
                    value={localPriceRange[0]}
                    onChange={(e) => setLocalPriceRange([parseInt(e.target.value) || 0, localPriceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                  <input
                    type="number"
                    value={localPriceRange[1]}
                    onChange={(e) => setLocalPriceRange([localPriceRange[0], parseInt(e.target.value) || 1000])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600 text-center">
                ${localPriceRange[0]} - ${localPriceRange[1]}
              </div>
            </div>
          </div>
          
          {/* Brands */}
          {brands && brands.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Brands
              </label>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSelectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilterSheet;