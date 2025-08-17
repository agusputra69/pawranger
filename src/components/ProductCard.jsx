import React, { memo, useCallback } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const ProductCard = memo(({ 
  product, 
  isWishlisted, 
  onToggleWishlist, 
  onAddToCart, 
  formatPrice 
}) => {
  // Memoized event handlers to prevent unnecessary re-renders
  const handleToggleWishlist = useCallback(() => {
    onToggleWishlist(product.id);
  }, [onToggleWishlist, product.id]);

  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2">
      {/* Product Image & Discount Badge */}
      <div className="relative mb-4">
        <div className="w-full h-48 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center text-6xl mb-4">
          {product.image}
        </div>
        
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="space-y-3">
        {/* Brand */}
        <div className="text-sm text-primary-600 font-semibold">
          {product.brand}
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {product.features?.slice(0, 2).map((feature, index) => (
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-800">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white py-3 rounded-full hover:bg-primary-700 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;