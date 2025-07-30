import { useState } from 'react';
import { ShoppingCart, Star, Heart, Filter, Search, Plus, Minus } from 'lucide-react';

const Shop = ({ cartItems, addToCart, onOpenCart, onNavigateToEcommerce }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);

  const categories = [
    { id: 'all', name: 'Semua Produk', icon: '🛍️' },
    { id: 'dog-food', name: 'Makanan Anjing', icon: '🐕' },
    { id: 'cat-food', name: 'Makanan Kucing', icon: '🐱' },
    { id: 'treats', name: 'Snack & Treats', icon: '🦴' },
    { id: 'supplements', name: 'Vitamin & Suplemen', icon: '💊' },
    { id: 'accessories', name: 'Aksesoris', icon: '🎾' }
  ];

  const products = [
    {
      id: 1,
      name: 'Royal Canin Adult Dog Food',
      category: 'dog-food',
      price: 285000,
      originalPrice: 320000,
      rating: 4.8,
      reviews: 156,
      image: '🐕',
      description: 'Makanan anjing dewasa dengan nutrisi seimbang',
      weight: '3kg',
      brand: 'Royal Canin',
      inStock: true,
      discount: 11
    },
    {
      id: 2,
      name: 'Whiskas Adult Cat Food',
      category: 'cat-food',
      price: 45000,
      originalPrice: 52000,
      rating: 4.6,
      reviews: 89,
      image: '🐱',
      description: 'Makanan kucing dewasa rasa tuna dan salmon',
      weight: '1.2kg',
      brand: 'Whiskas',
      inStock: true,
      discount: 13
    },
    {
      id: 3,
      name: 'Pedigree Dentastix',
      category: 'treats',
      price: 35000,
      originalPrice: 40000,
      rating: 4.7,
      reviews: 234,
      image: '🦴',
      description: 'Snack pembersih gigi untuk anjing',
      weight: '180g',
      brand: 'Pedigree',
      inStock: true,
      discount: 12
    },
    {
      id: 4,
      name: 'Pro Plan Puppy Food',
      category: 'dog-food',
      price: 195000,
      originalPrice: 220000,
      rating: 4.9,
      reviews: 78,
      image: '🐶',
      description: 'Makanan anak anjing dengan DHA untuk perkembangan otak',
      weight: '2.5kg',
      brand: 'Pro Plan',
      inStock: true,
      discount: 11
    },
    {
      id: 5,
      name: 'Felix Cat Treats',
      category: 'treats',
      price: 25000,
      originalPrice: 28000,
      rating: 4.5,
      reviews: 145,
      image: '🐾',
      description: 'Snack kucing rasa ayam dan hati',
      weight: '60g',
      brand: 'Felix',
      inStock: false,
      discount: 10
    },
    {
      id: 6,
      name: 'Vitamin Pet Health Plus',
      category: 'supplements',
      price: 125000,
      originalPrice: 145000,
      rating: 4.4,
      reviews: 67,
      image: '💊',
      description: 'Multivitamin untuk kesehatan hewan peliharaan',
      weight: '100 tablet',
      brand: 'Pet Health',
      inStock: true,
      discount: 14
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });



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
      minimumFractionDigits: 0
    }).format(price);
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

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              {/* Product Image & Discount Badge */}
              <div className="relative mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center text-6xl mb-4">
                  {product.image}
                </div>
                
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
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
                  <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-600 font-medium">{product.brand}</span>
                  <span className="text-sm text-gray-500">{product.weight}</span>
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
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} ulasan)
                  </span>
                </div>
                
                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className={`text-sm font-medium ${
                  product.inStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.inStock ? '✅ Tersedia' : '❌ Stok Habis'}
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.inStock
                      ? 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian atau kategori produk.</p>
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

export default Shop;