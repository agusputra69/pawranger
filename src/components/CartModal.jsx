import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const CartModal = ({ isOpen, onClose, cartItems, updateQuantity, removeItem, onNavigateToEcommerce, onCheckout }) => {



  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    onCheckout();
  };

  const navigateToEcommerce = () => {
    onClose();
    onNavigateToEcommerce();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Keranjang Belanja
              </h2>
              {cartItems.length > 0 && (
                <span className="bg-primary-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Keranjang Kosong
                </h3>
                <p className="text-gray-600 mb-6">
                  Belum ada produk di keranjang Anda
                </p>
                <button
                  onClick={navigateToEcommerce}
                  className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-colors font-semibold flex items-center space-x-2 mx-auto"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Mulai Belanja</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {item.image}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {item.brand} • {item.weight}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary-600">
                            {formatPrice(item.price)}
                          </span>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Subtotal and Remove */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-semibold text-gray-900">
                            Subtotal: {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              
              {/* Shipping Info */}
              <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">🚚</span>
                  <span>
                    {getTotalPrice() >= 200000 
                      ? 'Gratis ongkir untuk pesanan ini!' 
                      : `Tambah ${formatPrice(200000 - getTotalPrice())} lagi untuk gratis ongkir`
                    }
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={navigateToEcommerce}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-full hover:bg-gray-200 transition-colors font-semibold"
                >
                  Lanjut Belanja
                </button>
                
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full bg-primary-600 text-white py-3 rounded-full hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              {/* Security Badge */}
              <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-1">
                  <span>🔒</span>
                  <span>Pembayaran aman & terpercaya</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;