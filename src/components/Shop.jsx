import React, { useState, memo, useMemo, useCallback, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Filter, Search, Plus, Minus, Loader2 } from 'lucide-react';
import { getProducts } from '../lib/supabase';
import ProductSkeleton, { CategoryFilterSkeleton, SearchFilterSkeleton } from './ProductSkeleton';

const Shop = ({ cartItems, addToCart, onOpenCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }, []);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await getProducts();
        
        if (fetchError) {
          throw fetchError;
        }
        
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Gagal memuat produk. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'Semua Produk', icon: '🛍️' },
    { id: 'dog-food', name: 'Makanan Anjing', icon: '🐕' },
    { id: 'cat-food', name: 'Makanan Kucing', icon: '🐱' },
    { id: 'treats', name: 'Snack & Treats', icon: '🦴' },
    { id: 'supplements', name: 'Vitamin & Suplemen', icon: '💊' },
    { id: 'accessories', name: 'Aksesoris', icon: '🎾' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);



  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };



  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <section id="shop" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Pet Shop
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Toko Online
            <span className="text-primary-600 block">Makanan & Aksesoris Pet</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Belanja kebutuhan hewan peliharaan Anda dengan mudah. 
            Produk berkualitas tinggi dengan harga terjangkau dan pengiriman cepat.
          </p>
        </div>

        {/* Search and Cart */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={onOpenCart}
              className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Keranjang</span>
              {getTotalCartItems() > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalCartItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            <CategoryFilterSkeleton />
            <SearchFilterSkeleton />
            <ProductSkeleton count={8} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              {/* Product Image & Discount Badge */}
              <div className="relative mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center text-6xl" style={{display: product.image_url ? 'none' : 'flex'}}>
                    🛍️
                  </div>
                </div>
                
                {product.discount_percentage && product.discount_percentage > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    -{product.discount_percentage}%
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
                  <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-600 font-medium">{product.brand || 'PawRanger'}</span>
                  <span className="text-sm text-gray-500">{product.weight || 'N/A'}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 4.5)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating || 4.5} ({product.review_count || 0} ulasan)
                  </span>
                </div>
                
                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className={`text-sm font-medium ${
                  product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock_quantity > 0 ? `✅ Tersedia (${product.stock_quantity})` : '❌ Stok Habis'}
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock_quantity <= 0}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.stock_quantity > 0
                      ? 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock_quantity > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}</span>
                </button>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              {/* Enhanced Visual */}
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <div className="text-6xl">🐾</div>
                </div>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🔍</div>
                </div>
              </div>
              
              {/* Dynamic Messaging */}
              {searchTerm || selectedCategory !== 'all' ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Tidak Ada Hasil Ditemukan</h3>
                  <p className="text-gray-600 mb-6">
                    Kami tidak menemukan produk yang cocok dengan pencarian 
                    {searchTerm && <span className="font-semibold text-primary-600">\"{searchTerm}\"</span>}
                    {searchTerm && selectedCategory !== 'all' && ' di kategori '}
                    {selectedCategory !== 'all' && <span className="font-semibold text-primary-600">{categories.find(c => c.id === selectedCategory)?.name}</span>}
                  </p>
                  
                  {/* Actionable Suggestions */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all duration-300 font-semibold transform hover:scale-105"
                      >
                        🔄 Reset Pencarian
                      </button>
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-full hover:bg-primary-50 transition-all duration-300 font-semibold"
                      >
                        📋 Lihat Semua Kategori
                      </button>
                    </div>
                    
                    {/* Popular Categories Suggestion */}
                    <div className="mt-8">
                      <p className="text-sm text-gray-500 mb-4">Atau coba kategori populer:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {categories.slice(1, 4).map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setSearchTerm('');
                            }}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-all duration-300 text-sm font-medium"
                          >
                            {category.icon} {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Produk</h3>
                  <p className="text-gray-600 mb-6">
                    Toko kami sedang mempersiapkan produk-produk terbaik untuk hewan peliharaan Anda.
                    Silakan kembali lagi nanti atau hubungi kami untuk informasi lebih lanjut.
                  </p>
                  
                  {/* Contact Actions */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all duration-300 font-semibold transform hover:scale-105"
                      >
                        🔄 Muat Ulang
                      </button>
                      <button
                        className="bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-full hover:bg-primary-50 transition-all duration-300 font-semibold"
                      >
                        📞 Hubungi Kami
                      </button>
                    </div>
                    
                    {/* Newsletter Signup */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Dapatkan Notifikasi Produk Baru</h4>
                      <p className="text-sm text-gray-600 mb-4">Jadilah yang pertama tahu saat produk baru tersedia!</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Email Anda"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors font-medium">
                          Daftar
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Butuh Bantuan Memilih Produk?
            </h3>
            <p className="text-gray-600 mb-6">
              Tim ahli kami siap membantu Anda memilih produk terbaik 
              sesuai kebutuhan hewan peliharaan Anda.
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all duration-300 font-semibold transform hover:scale-105">
              Konsultasi Gratis
            </button>
          </div>
        </div>


      </div>
    </section>
  );
};

export default memo(Shop);