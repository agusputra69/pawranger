import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import PropTypes from 'prop-types';

const ProductFilters = memo(({
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
  clearFilters,
  isLoading = false,
  isMobile = false,
  isOpen = false,
  onClose = () => {}
}) => {
  // All hooks must be called before any conditional returns
  const [hasError, setHasError] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    categories: true,
    priceRange: false,
    brands: false
  });
  const [searchDebounce, setSearchDebounce] = useState(searchTerm);
  const [, setFocusedElement] = useState(null);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [visibleBrandCount, setVisibleBrandCount] = useState(10);
  
  const BRANDS_PER_PAGE = 10;
  const MAX_VISIBLE_BRANDS = 50;

  // Validate required props
  useEffect(() => {
    try {
      if (!Array.isArray(categoriesWithCounts)) {
        throw new Error('categoriesWithCounts must be an array');
      }
      if (!Array.isArray(priceRange) || priceRange.length !== 2) {
        throw new Error('priceRange must be an array with 2 elements');
      }
      if (!Array.isArray(selectedBrands)) {
        throw new Error('selectedBrands must be an array');
      }
      if (!Array.isArray(brands)) {
        throw new Error('brands must be an array');
      }
      setHasError(false);
    } catch (error) {
      console.error('ProductFilters validation error:', error);
      setHasError(true);
    }
  }, [categoriesWithCounts, priceRange, selectedBrands, brands]);

  // Debounced search effect
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        if (searchDebounce !== searchTerm && typeof setSearchTerm === 'function') {
          setSearchTerm(searchDebounce);
        }
      }, 300);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Search debounce error:', error);
    }
  }, [searchDebounce, setSearchTerm, searchTerm]);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleBrandCount(BRANDS_PER_PAGE);
  }, [brandSearchTerm]);

  // Memoized brands list
  const memoizedBrands = useMemo(() => {
    try {
      if (!Array.isArray(brands)) {
        console.warn('Brands is not an array, returning empty array');
        return [];
      }
      return brands.filter(brand => brand && typeof brand === 'string').sort();
    } catch (error) {
      console.error('Error processing brands:', error);
      return [];
    }
  }, [brands]);

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm.trim()) {
      return memoizedBrands;
    }
    return memoizedBrands.filter(brand => 
      brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );
  }, [memoizedBrands, brandSearchTerm]);

  // Get visible brands for virtualization
  const visibleBrands = useMemo(() => {
    return filteredBrands.slice(0, Math.min(visibleBrandCount, MAX_VISIBLE_BRANDS));
  }, [filteredBrands, visibleBrandCount]);

  // Load more brands handler
  const loadMoreBrands = useCallback(() => {
    setVisibleBrandCount(prev => Math.min(prev + BRANDS_PER_PAGE, filteredBrands.length));
  }, [filteredBrands.length]);

  // Toggle section expansion
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  // Focus management
  const handleFocus = useCallback((elementId) => {
    setFocusedElement(elementId);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedElement(null);
  }, []);

  // Error fallback UI - after all hooks
  if (hasError) {
    return (
      <div className="lg:w-1/4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-2 text-red-600 mb-2">
            <X className="w-5 h-5" />
            <h3 className="font-medium">Filter Error</h3>
          </div>
          <p className="text-sm text-red-700">
            There was an error loading the filters. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Collapsible section component
  const CollapsibleSection = ({ title, isExpanded, onToggle, children, ariaLabel, icon }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        onKeyDown={(e) => handleKeyDown(e, onToggle)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
        aria-expanded={isExpanded}
        aria-label={ariaLabel}
        onFocus={() => handleFocus(`section-${title}`)}
        onBlur={handleBlur}
      >
        <div className="flex items-center space-x-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && title === 'Search' && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" aria-hidden="true" />
          )}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );

  // Mobile overlay and desktop container
  const containerClasses = isMobile
    ? `fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`
    : 'w-full';

  const contentClasses = isMobile
    ? 'fixed inset-y-0 right-0 w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto'
    : 'bg-white rounded-2xl shadow-sm sticky top-8 w-full h-full';

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-label="Close filters overlay"
        />
      )}
      
      <div className={containerClasses}>
        <div className={contentClasses}>
          {/* Mobile header */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Desktop header */}
          {!isMobile && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Filter className="w-5 h-5" aria-hidden="true" />
                <span>Filters</span>
              </h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 px-3 py-1 rounded-md hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Clear all filters"
              >
                Reset
              </button>
            </div>
          )}

          {/* Search Section */}
          <CollapsibleSection
            title="Search"
            isExpanded={expandedSections.search}
            onToggle={() => toggleSection('search')}
            ariaLabel="Toggle search section"
            icon="🔍"
          >
            <div className="space-y-3">
              <label htmlFor="product-search" className="block text-sm font-medium text-gray-700">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                <input
                  id="product-search"
                  type="text"
                  placeholder="Search products"
                  value={searchDebounce}
                  onChange={(e) => setSearchDebounce(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base touch-manipulation"
                  aria-describedby="search-help"
                  onFocus={() => handleFocus('search-input')}
                  onBlur={handleBlur}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <p id="search-help" className="text-xs text-gray-500">
                Search by product name, brand, or description
              </p>
            </div>
          </CollapsibleSection>

          {/* Categories Section */}
          <CollapsibleSection
            title="Categories"
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
            ariaLabel="Toggle categories section"
            icon="📂"
          >
            <div className="space-y-2" role="radiogroup" aria-label="Product categories">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation min-h-[48px] ${
                  !selectedCategory
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'hover:bg-gray-100 focus:bg-gray-100'
                }`}
                role="radio"
                aria-checked={!selectedCategory}
                onFocus={() => handleFocus('category-all')}
                onBlur={handleBlur}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl" aria-hidden="true">🏪</span>
                    <span className="font-medium">All Categories</span>
                  </div>
                </div>
              </button>
              {categoriesWithCounts.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation min-h-[48px] ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'hover:bg-gray-100 focus:bg-gray-100'
                  }`}
                  role="radio"
                  aria-checked={selectedCategory === category.id}
                  onFocus={() => handleFocus(`category-${category.id}`)}
                  onBlur={handleBlur}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl" aria-hidden="true">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full transition-colors ${
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
          </CollapsibleSection>

          {/* Price Range Section */}
          <CollapsibleSection
            title="Price Range"
            isExpanded={expandedSections.priceRange}
            onToggle={() => toggleSection('priceRange')}
            ariaLabel="Toggle price range section"
            icon="💰"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <label htmlFor="min-price" className="block text-xs font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={priceRange[0] || ''}
                    onChange={(e) => {
                       try {
                         const value = parseInt(e.target.value) || 0;
                         if (typeof setPriceRange === 'function' && Array.isArray(priceRange)) {
                           setPriceRange([Math.max(0, value), priceRange[1]]);
                         }
                       } catch (error) {
                         console.error('Error setting min price:', error);
                       }
                     }}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 touch-manipulation"
                    aria-describedby="price-help"
                    onFocus={() => handleFocus('min-price')}
                    onBlur={handleBlur}
                  />
                </div>
                <span className="text-gray-500 mt-6" aria-hidden="true">-</span>
                <div className="flex-1">
                  <label htmlFor="max-price" className="block text-xs font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    placeholder="∞"
                    min="0"
                    value={priceRange[1] || ''}
                    onChange={(e) => {
                       try {
                         const value = parseInt(e.target.value) || 1000000;
                         if (typeof setPriceRange === 'function' && Array.isArray(priceRange)) {
                           setPriceRange([priceRange[0], Math.max(0, value)]);
                         }
                       } catch (error) {
                         console.error('Error setting max price:', error);
                       }
                     }}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 touch-manipulation"
                    aria-describedby="price-help"
                    onFocus={() => handleFocus('max-price')}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <p id="price-help" className="text-xs text-gray-500">
                Set your budget range to filter products
              </p>
            </div>
          </CollapsibleSection>

          {/* Brands Section */}
          <CollapsibleSection
            title="Brands"
            isExpanded={expandedSections.brands}
            onToggle={() => toggleSection('brands')}
            ariaLabel="Toggle brands section"
            icon="🏷️"
          >
            <div className="space-y-3">
              {/* Brand search input for long lists */}
              {memoizedBrands.length > 10 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearchTerm}
                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    aria-label="Search brands"
                  />
                </div>
              )}
              
              {/* Virtualized brand list */}
              <div className="max-h-48 overflow-y-auto">
                {visibleBrands.length > 0 ? (
                  <div className="space-y-2">
                    {visibleBrands.map((brand) => (
                      <label 
                        key={brand} 
                        className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 min-h-[44px] touch-manipulation"
                        onFocus={() => handleFocus(`brand-${brand}`)}
                        onBlur={handleBlur}
                      >
                        <input
                           type="checkbox"
                           checked={Array.isArray(selectedBrands) && selectedBrands.includes(brand)}
                           onChange={() => {
                             try {
                               if (typeof toggleBrand === 'function') {
                                 toggleBrand(brand);
                               }
                             } catch (error) {
                               console.error('Error toggling brand:', error);
                             }
                           }}
                           className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 w-4 h-4"
                           aria-describedby={`brand-${brand}-label`}
                         />
                        <span 
                          id={`brand-${brand}-label`}
                          className="text-sm text-gray-700 flex-1"
                        >
                          {brand}
                        </span>
                      </label>
                    ))}
                    
                    {/* Load more button for virtualization */}
                    {filteredBrands.length > visibleBrandCount && visibleBrandCount < MAX_VISIBLE_BRANDS && (
                      <button
                        onClick={loadMoreBrands}
                        className="w-full py-2 px-4 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200 border border-primary-200 hover:border-primary-300"
                        aria-label={`Load ${Math.min(BRANDS_PER_PAGE, filteredBrands.length - visibleBrandCount)} more brands`}
                      >
                        Load More ({filteredBrands.length - visibleBrandCount} remaining)
                      </button>
                    )}
                    
                    {/* Show total count for large lists */}
                    {filteredBrands.length > MAX_VISIBLE_BRANDS && visibleBrandCount >= MAX_VISIBLE_BRANDS && (
                      <div className="text-xs text-gray-500 text-center py-2">
                        Showing {MAX_VISIBLE_BRANDS} of {filteredBrands.length} brands
                        {brandSearchTerm && ' (filtered)'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    {brandSearchTerm ? 'No brands found matching your search.' : 'No brands available.'}
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>

          {/* Mobile Clear Filters Button */}
          {isMobile && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  clearFilters();
                  onClose();
                }}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200 font-medium touch-manipulation"
                aria-label="Clear all filters and close"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

ProductFilters.displayName = 'ProductFilters';

// PropTypes for type checking
ProductFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  setSelectedCategory: PropTypes.func.isRequired,
  categoriesWithCounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  setPriceRange: PropTypes.func.isRequired,
  selectedBrands: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleBrand: PropTypes.func.isRequired,
  brands: PropTypes.arrayOf(PropTypes.string).isRequired,
  clearFilters: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default ProductFilters;