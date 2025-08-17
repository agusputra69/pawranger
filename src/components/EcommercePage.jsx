import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../lib/supabase';
import { ArrowLeft, ShoppingCart, HomeIcon } from 'lucide-react';
import ProductFilters from './ecommerce/ProductFilters';
import ProductToolbar from './ecommerce/ProductToolbar';
import ProductCard from './ecommerce/ProductCard';
import EmptyState from './ecommerce/EmptyState';
import Pagination from './ecommerce/Pagination';
import ProductSkeleton, { SearchFilterSkeleton } from './ProductSkeleton';
import MobileFilterSheet from './ecommerce/MobileFilterSheet';
import MobileFilterButton from './ecommerce/MobileFilterButton';

const EcommercePage = ({ onNavigateHome, onOpenCart, cartItems, addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice')) || 0,
    parseInt(searchParams.get('maxPrice')) || 1000000
  ]);
  const [selectedBrands, setSelectedBrands] = useState(searchParams.get('brands') ? searchParams.get('brands').split(',') : []);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);

  // Update URL parameters when filters change
  const updateURLParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || 
          (Array.isArray(value) && value.length === 0) ||
          (key === 'category' && value === 'all') ||
          (key === 'page' && value === 1)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','));
      } else {
        newParams.set(key, value.toString());
      }
    });
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);
  // const [isRetrying, setIsRetrying] = useState(false); // Removed unused state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const itemsPerPage = 9;



  // Fetch products from Supabase with comprehensive error handling
  const fetchProducts = useCallback(async (filters = {}, isRetry = false) => {
    try {
      if (isRetry) {
        // setIsRetrying(true); // Removed unused state
      } else {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching products with filters:', filters);
      const { data, error } = await getProducts(filters);
      if (error) {
        throw new Error(error.message || 'Failed to fetch products');
      }
      
      console.log('Products fetched successfully:', data?.length || 0, 'products');
      setProducts(data || []);
      retryCountRef.current = 0; // Reset retry count on success
    } catch (err) {
      console.error('Error fetching products:', err);
      setError({
        message: err.message || 'Failed to load products. Please check your connection and try again.',
        canRetry: retryCountRef.current < 3
      });
      retryCountRef.current += 1;
    } finally {
      setLoading(false);
      // setIsRetrying(false); // Removed unused state
    }
  }, []);

  // Retry function with exponential backoff (commented out as unused)
  // const retryFetchProducts = async () => {
  //   if (retryCount >= 3) return;
  //   
  //   setRetryCount(prev => prev + 1);
  //   const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
  //   
  //   setTimeout(() => {
  //     const filters = {
  //       category: selectedCategory !== 'all' ? selectedCategory : null,
  //       search: searchTerm || null,
  //       minPrice: priceRange[0] > 0 ? priceRange[0] : null,
  //       maxPrice: priceRange[1] < 1000000 ? priceRange[1] : null,
  //       brands: selectedBrands.length > 0 ? selectedBrands : null,
  //       sortBy: sortBy
  //     };
  //     fetchProducts(filters, true);
  //   }, delay);
  // };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Refetch when filters change
  useEffect(() => {
    const filters = {
      category: selectedCategory !== 'all' ? selectedCategory : null,
      search: searchTerm || null,
      minPrice: priceRange[0] > 0 ? priceRange[0] : null,
      maxPrice: priceRange[1] < 1000000 ? priceRange[1] : null,
      brands: selectedBrands.length > 0 ? selectedBrands : null,
      sortBy: sortBy
    };
    
    // Only refetch if we have active filters (not initial state)
    if (selectedCategory !== 'all' || searchTerm || priceRange[0] > 0 || priceRange[1] < 1000000 || selectedBrands.length > 0 || sortBy !== 'popular') {
      fetchProducts(filters);
    }
  }, [selectedCategory, searchTerm, priceRange, selectedBrands, sortBy, fetchProducts]);

  // Extract unique brands from products
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set((products || []).map(product => product.brand).filter(Boolean))];
    return uniqueBrands.sort();
  }, [products]);

  // Update categories with actual product counts
  const categoriesWithCounts = useMemo(() => {
    const categoryCounts = (products || []).reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return [
      { id: 'all', name: 'All Products', icon: '🏪', count: (products || []).length },
      { id: 'food', name: 'Food', icon: '🍖', count: categoryCounts['food'] || 0 },
      { id: 'toys', name: 'Toys', icon: '🧸', count: categoryCounts['toys'] || 0 },
      { id: 'accessories', name: 'Accessories', icon: '🎾', count: categoryCounts['accessories'] || 0 },
      { id: 'health', name: 'Health', icon: '💊', count: categoryCounts['health'] || 0 },
      { id: 'grooming', name: 'Grooming', icon: '🧴', count: categoryCounts['grooming'] || 0 }
    ];
  }, [products]);

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil((products || []).length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = (products || []).slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, paginatedProducts };
  }, [products, currentPage, itemsPerPage]);

  const { totalPages, paginatedProducts } = paginationData;



  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000000]);
    setSelectedBrands([]);
    setCurrentPage(1);
  };

  // Memoized event handlers to prevent unnecessary re-renders
  // Handle page change with URL parameter updates
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    updateURLParams({ page });
  }, [updateURLParams]);

  const handleAddToCart = useCallback((product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity
    });
  }, [addToCart]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURLParams({ category: category, page: 1 });
  }, [updateURLParams]);

  const handleBrandToggle = useCallback((brand) => {
    setSelectedBrands(prev => {
      const newBrands = prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand];
      updateURLParams({ brands: newBrands, page: 1 });
      return newBrands;
    });
    setCurrentPage(1);
  }, [updateURLParams]);

  const handleSortChange = useCallback((sort) => {
    setSortBy(sort);
    updateURLParams({ sort });
  }, [updateURLParams]);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    updateURLParams({ search: term, page: 1 });
  }, [updateURLParams]);

  const handlePriceRangeChange = useCallback((range) => {
    setPriceRange(range);
    setCurrentPage(1);
    updateURLParams({ minPrice: range[0], maxPrice: range[1], page: 1 });
  }, [updateURLParams]);

  // Mobile filter handlers
  const handleOpenMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(true);
  }, []);

  const handleCloseMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(false);
  }, []);

  const handleApplyMobileFilters = useCallback(() => {
    // Filters are already applied through individual handlers
    // This is just for any additional logic if needed
  }, []);

  const handleResetMobileFilters = useCallback(() => {
    clearFilters();
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || 
           selectedCategory !== 'all' || 
           priceRange[0] > 0 || 
           priceRange[1] < 1000000 || 
           selectedBrands.length > 0;
  }, [searchTerm, selectedCategory, priceRange, selectedBrands]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Pet Store</h1>
              <p className="text-xl text-gray-600 mb-8">Everything your furry friends need, delivered to your door</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Back to Landing Page */}
              <button 
                onClick={onNavigateHome}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              {/* Services Button */}
              <button 
                onClick={() => {
                  onNavigateHome();
                  setTimeout(() => {
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Other Services</span>
              </button>
              
              {/* Cart Button */}
              <button 
                onClick={onOpenCart}
                className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {(cartItems || []).reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {(cartItems || []).reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/4">
            <ProductFilters
              searchTerm={searchTerm}
              setSearchTerm={handleSearchChange}
              categoriesWithCounts={categoriesWithCounts}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              priceRange={priceRange}
              setPriceRange={handlePriceRangeChange}
              brands={brands}
              selectedBrands={selectedBrands}
              toggleBrand={handleBrandToggle}
              clearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <ProductToolbar
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={handleSortChange}
            />

            {/* Loading State */}
            {loading ? (
              <div className="space-y-8">
                <SearchFilterSkeleton />
                <ProductSkeleton count={12} viewMode={viewMode} />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Error loading products</h3>
                <p className="text-gray-600 mb-6">{error?.message || error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <EmptyState
                searchTerm={searchTerm}
                selectedBrands={selectedBrands}
                priceRange={priceRange}
                clearFilters={clearFilters}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                setPriceRange={setPriceRange}
              />
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                      formatPrice={formatPrice}
                      addToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <MobileFilterButton 
        onClick={handleOpenMobileFilter}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onClose={handleCloseMobileFilter}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        categories={categoriesWithCounts.map(cat => cat.name)}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        brands={brands}
        selectedBrands={selectedBrands}
        onBrandChange={setSelectedBrands}
        onApplyFilters={handleApplyMobileFilters}
        onResetFilters={handleResetMobileFilters}
      />
    </div>
  );
};

export default EcommercePage;