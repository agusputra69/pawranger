import React from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({
  product,
  viewMode,
  wishlist,
  toggleWishlist,
  addToCart,
  formatPrice
}) => {
  return (
    <div
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
          {(product.features || []).slice(0, 2).map((feature, index) => (
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
            product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.stock_quantity > 0 ? `✅ In Stock (${product.stock_quantity})` : `❌ Out of Stock`}
          </div>
          
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock_quantity === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
              product.stock_quantity > 0
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
  );
};

export default ProductCard;