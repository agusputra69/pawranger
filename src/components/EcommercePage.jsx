import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Filter, Search, Grid, List, SlidersHorizontal, ArrowUpDown, ChevronDown, X, MapPin, Truck, Shield, Award, ArrowLeft, Home } from 'lucide-react';

const EcommercePage = ({ cartItems, addToCart, onOpenCart, onNavigateHome, onCheckout, user }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    { id: 'all', name: 'Semua Produk', icon: '🛍️', count: 156 },
    { id: 'dog-food', name: 'Makanan Anjing', icon: '🐕', count: 45 },
    { id: 'cat-food', name: 'Makanan Kucing', icon: '🐱', count: 38 },
    { id: 'treats', name: 'Snack & Treats', icon: '🦴', count: 28 },
    { id: 'supplements', name: 'Vitamin & Suplemen', icon: '💊', count: 22 },
    { id: 'accessories', name: 'Aksesoris', icon: '🎾', count: 23 }
  ];

  const brands = ['Royal Canin', 'Whiskas', 'Pedigree', 'Pro Plan', 'Felix', 'Pet Health', 'Hills', 'Eukanuba'];

  const products = [
    {
      id: 1,
      name: 'Royal Canin Adult Dog Food Premium',
      category: 'dog-food',
      price: 285000,
      originalPrice: 320000,
      rating: 4.8,
      reviews: 156,
      image: '🐕',
      description: 'Makanan anjing dewasa dengan nutrisi seimbang untuk kesehatan optimal',
      weight: '3kg',
      brand: 'Royal Canin',
      inStock: true,
      discount: 11,
      tags: ['Premium', 'Adult', 'Balanced Nutrition'],
      features: ['High Protein', 'Omega 3 & 6', 'Digestive Health']
    },
    {
      id: 2,
      name: 'Whiskas Adult Cat Food Tuna & Salmon',
      category: 'cat-food',
      price: 45000,
      originalPrice: 52000,
      rating: 4.6,
      reviews: 89,
      image: '🐱',
      description: 'Makanan kucing dewasa rasa tuna dan salmon dengan vitamin lengkap',
      weight: '1.2kg',
      brand: 'Whiskas',
      inStock: true,
      discount: 13,
      tags: ['Tuna', 'Salmon', 'Adult'],
      features: ['Complete Nutrition', 'Healthy Coat', 'Strong Bones']
    },
    {
      id: 3,
      name: 'Pedigree Dentastix Daily Oral Care',
      category: 'treats',
      price: 35000,
      originalPrice: 40000,
      rating: 4.7,
      reviews: 234,
      image: '🦴',
      description: 'Snack pembersih gigi untuk anjing dengan formula khusus',
      weight: '180g',
      brand: 'Pedigree',
      inStock: true,
      discount: 12,
      tags: ['Dental Care', 'Daily Treat', 'Healthy Teeth'],
      features: ['Reduces Tartar', 'Fresh Breath', 'Daily Use']
    },
    {
      id: 4,
      name: 'Pro Plan Puppy Food with DHA',
      category: 'dog-food',
      price: 195000,
      originalPrice: 220000,
      rating: 4.9,
      reviews: 78,
      image: '🐶',
      description: 'Makanan anak anjing dengan DHA untuk perkembangan otak optimal',
      weight: '2.5kg',
      brand: 'Pro Plan',
      inStock: true,
      discount: 11,
      tags: ['Puppy', 'DHA', 'Brain Development'],
      features: ['DHA for Brain', 'High Quality Protein', 'Immune Support']
    },
    {
      id: 5,
      name: 'Felix Cat Treats Chicken & Liver',
      category: 'treats',
      price: 25000,
      originalPrice: 28000,
      rating: 4.5,
      reviews: 145,
      image: '🐾',
      description: 'Snack kucing rasa ayam dan hati yang lezat dan bergizi',
      weight: '60g',
      brand: 'Felix',
      inStock: false,
      discount: 10,
      tags: ['Chicken', 'Liver', 'Tasty'],
      features: ['Real Meat', 'No Artificial Colors', 'Irresistible Taste']
    },
    {
      id: 6,
      name: 'Pet Health Multivitamin Plus',
      category: 'supplements',
      price: 125000,
      originalPrice: 145000,
      rating: 4.4,
      reviews: 67,
      image: '💊',
      description: 'Multivitamin lengkap untuk kesehatan hewan peliharaan',
      weight: '100 tablet',
      brand: 'Pet Health',
      inStock: true,
      discount: 14,
      tags: ['Multivitamin', 'Health Support', 'Daily Supplement'],
      features: ['Complete Vitamins', 'Immune Boost', 'Energy Support']
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    
    return matchesCategory && matchesSearch && matchesPrice && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default: // popular
        return b.reviews - a.reviews;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Toko Online Pet Food & Aksesoris
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} produk ditemukan
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Back to Landing Page */}
              <button 
                onClick={onNavigateHome}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kembali</span>
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
                <span className="hidden sm:inline">Layanan Lain</span>
              </button>
              
              {/* Cart Button */}
              <button 
                onClick={onOpenCart}
                className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Keranjang</span>
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
                <h3 className="text-lg font-bold text-gray-900">Filter Produk</h3>
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
                  Cari Produk
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nama produk, brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Kategori
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rentang Harga
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Brand
                </label>
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
                  <span className="text-sm text-gray-600">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="popular">Terpopuler</option>
                    <option value="newest">Terbaru</option>
                    <option value="price-low">Harga Terendah</option>
                    <option value="price-high">Harga Tertinggi</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-gray-600 mb-6">Coba ubah filter atau kata kunci pencarian.</p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-colors"
                >
                  Reset Filter
                </button>
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
                            {product.rating} ({product.reviews})
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
                            {product.inStock ? '✅ Tersedia' : '❌ Stok Habis'}
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
                            <span>Tambah</span>
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