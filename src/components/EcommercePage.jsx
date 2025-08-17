import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, X, ArrowLeft, Home } from 'lucide-react';
import { getProducts } from '../lib/supabase';
import ProductSkeleton, { SearchFilterSkeleton } from './ProductSkeleton';

const EcommercePage = ({ onNavigateHome, onOpenCart, cartItems, addToCart }) => {
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  // const [isRetrying, setIsRetrying] = useState(false); // Removed unused state
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
      
      const { data, error } = await getProducts(filters);
      if (error) {
        throw new Error(error.message || 'Failed to fetch products');
      }
      
      setProducts(data || []);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error fetching products:', err);
      setError({
        message: err.message || 'Failed to load products. Please check your connection and try again.',
        canRetry: retryCount < 3
      });
    } finally {
      setLoading(false);
      // setIsRetrying(false); // Removed unused state
    }
  }, [retryCount]);

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
  }, []);

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
  }, [selectedCategory, searchTerm, priceRange, selectedBrands, sortBy]);

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
      { id: 'dog-food', name: 'Dog Food', icon: '🐕', count: categoryCounts['dog-food'] || 0 },
      { id: 'cat-food', name: 'Cat Food', icon: '🐱', count: categoryCounts['cat-food'] || 0 },
      { id: 'accessories', name: 'Accessories', icon: '🎾', count: categoryCounts['accessories'] || 0 },
      { id: 'toys', name: 'Toys', icon: '🧸', count: categoryCounts['toys'] || 0 },
      { id: 'treats', name: 'Treats', icon: '🦴', count: categoryCounts['treats'] || 0 },
      { id: 'supplements', name: 'Health', icon: '💊', count: categoryCounts['supplements'] || 0 }
    ];
  }, [products]);

  // Products are now filtered and sorted by Supabase
  const totalPages = Math.ceil((products || []).length / itemsPerPage);
  const paginatedProducts = (products || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };



  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setPriceRange([0, 1000000]);
    setSelectedBrands([]);
    setSortBy('popular');
    setCurrentPage(1);
  };

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
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Other Services</span>
              </button>
              
              {/* Cart Button */}
              <button 
                onClick={onOpenCart}
                className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
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

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* View Mode */}
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

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
              <div className="text-center py-20">
                <div className="max-w-lg mx-auto">
                  {/* Enhanced Visual Design */}
                  <div className="relative mb-8">
                    <div className="w-36 h-36 mx-auto bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <div className="text-7xl animate-pulse">🛍️</div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-md">
                      <div className="text-3xl">🔍</div>
                    </div>
                  </div>
                  
                  {/* Context-Aware Messaging */}
                  {searchTerm || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000000 ? (
                    <>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Tidak Ada Produk Ditemukan</h3>
                      <div className="text-gray-600 mb-8 space-y-2">
                        <p>Kami tidak menemukan produk yang sesuai dengan kriteria:</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {searchTerm && (
                            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                              🔍 \"{searchTerm}\"
                            </span>
                          )}
                          {selectedBrands.length > 0 && (
                            <span className="bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-medium">
                              🏷️ {selectedBrands.length} brand dipilih
                            </span>
                          )}
                          {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                            <span className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium">
                              💰 Rp {priceRange[0].toLocaleString()} - Rp {priceRange[1].toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actionable Solutions */}
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                             onClick={clearFilters}
                             className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg"
                           >
                             🔄 Reset Semua Filter
                           </button>
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setCurrentPage(1);
                            }}
                            className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-full hover:bg-primary-50 transition-all duration-300 font-semibold shadow-md"
                          >
                            🗑️ Hapus Pencarian
                          </button>
                        </div>
                        
                        {/* Smart Suggestions */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mt-8">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-center">
                            <span className="text-xl mr-2">💡</span>
                            Saran Pencarian
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-2">Coba kata kunci yang lebih umum</p>
                              <div className="flex flex-wrap justify-center gap-1">
                                {['makanan', 'mainan', 'perawatan'].map((keyword) => (
                                  <button
                                    key={keyword}
                                    onClick={() => {
                                      setSearchTerm(keyword);
                                      clearFilters();
                                    }}
                                    className="bg-white text-gray-700 px-3 py-1 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors text-xs font-medium border"
                                  >
                                    {keyword}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-2">Perluas rentang harga</p>
                              <button
                                onClick={() => {
                                  setPriceRange([0, 1000000]);
                                  setCurrentPage(1);
                                }}
                                className="bg-green-100 text-green-700 px-4 py-2 rounded-full hover:bg-green-200 transition-colors text-sm font-medium"
                              >
                                💰 Semua Harga
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Toko Sedang Kosong</h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        Kami sedang mempersiapkan koleksi produk terbaik untuk hewan peliharaan kesayangan Anda.
                        Mohon bersabar dan kembali lagi segera!
                      </p>
                      
                      {/* Engagement Actions */}
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg"
                          >
                            🔄 Muat Ulang Halaman
                          </button>
                          <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-full hover:bg-primary-50 transition-all duration-300 font-semibold shadow-md"
                          >
                            📞 Hubungi Tim Kami
                          </button>
                        </div>
                        
                        {/* Newsletter & Updates */}
                        <div className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 rounded-2xl p-8 mt-8 shadow-inner">
                          <div className="text-center mb-6">
                            <div className="text-4xl mb-3">📬</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Jadilah Yang Pertama Tahu!</h4>
                            <p className="text-gray-600">Dapatkan notifikasi saat produk baru tersedia dan penawaran eksklusif lainnya.</p>
                          </div>
                          
                          <div className="max-w-md mx-auto">
                            <div className="flex gap-3">
                              <input
                                type="email"
                                placeholder="Masukkan email Anda"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                              />
                              <button className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105">
                                Daftar
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <span className="text-green-500 mr-1">✓</span>
                                Gratis
                              </span>
                              <span className="flex items-center">
                                <span className="text-green-500 mr-1">✓</span>
                                Tanpa Spam
                              </span>
                              <span className="flex items-center">
                                <span className="text-green-500 mr-1">✓</span>
                                Bisa Berhenti Kapan Saja
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group ${
                        viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative ${
                        viewMode === 'list' ? 'w-24 h-24 flex-shrink-0 mr-4' : 'mb-4'
                      }`}>
                        <div className={`bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center ${
                          viewMode === 'list' ? 'w-24 h-24 text-3xl' : 'w-full h-48 text-6xl'
                        }`}>
                          {product.image}
                        </div>
                        
                        {product.discount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            -{product.discount}%
                          </div>
                        )}
                        
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
                            wishlist.includes(product.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary-600 font-medium">{product.brand}</span>
                          <span className="text-sm text-gray-500">{product.weight}</span>
                        </div>
                        
                        <h3 className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors ${
                          viewMode === 'list' ? 'text-lg' : 'text-lg'
                        }`}>
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.review_count})
                          </span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary-600">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        
                        {/* Stock & Add to Cart */}
                        <div className={`flex items-center justify-between ${
                          viewMode === 'list' ? 'mt-4' : ''
                        }`}>
                          <div className={`text-sm font-medium ${
                            product.inStock ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.inStock ? `✅ In Stock` : `❌ Out of Stock`}
                          </div>
                          
                          <button
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                              product.inStock
                                ? 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
                )}
              </>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default EcommercePage;