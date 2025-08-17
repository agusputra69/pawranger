import React, { useState } from 'react';
import { ShoppingBag, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';

const DesktopNav = ({ 
  onNavigateToEcommerce, 
  onNavigateToBooking, 
  onNavigateToDashboard, 
  smoothScroll, 
  user, 
  login, 
  logout, 
  openCart, 
  cartItemsCount, 
  isCartLoading, 
  cartError 
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <div className="hidden md:flex items-center space-x-8">
      <nav className="flex items-center space-x-8">
        <button
          onClick={() => smoothScroll('home')}
          className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 relative group"
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button
          onClick={() => smoothScroll('services')}
          className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 relative group"
        >
          Services
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button
          onClick={onNavigateToEcommerce}
          className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 relative group flex items-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
        </button>
        
        {/* Info Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 relative group flex items-center space-x-1"
          >
            <span>Info</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isInfoOpen ? 'rotate-180' : ''}`} />
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          
          {/* Dropdown Menu */}
          {isInfoOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={() => {
                  smoothScroll('about');
                  setIsInfoOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => {
                  smoothScroll('gallery');
                  setIsInfoOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
              >
                Gallery
              </button>
              <button
                onClick={() => {
                  smoothScroll('contact');
                  setIsInfoOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
              >
                Contact
              </button>
            </div>
          )}
        </div>
      </nav>
      
      <div className="flex items-center space-x-4">
        {/* Cart Button */}
        <button 
          onClick={openCart}
          className={`relative p-2 transition-colors ${
            isCartLoading 
              ? 'text-gray-400 cursor-not-allowed' 
              : cartError 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-700 hover:text-primary-600'
          }`}
          disabled={isCartLoading}
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </button>
        
        {/* User Authentication */}
        {user ? (
          <div className="flex items-center space-x-3">
            <button 
              onClick={onNavigateToDashboard}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>{user.name}</span>
            </button>
            <button 
              onClick={logout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Login</span>
          </button>
        )}
        
        <button 
          onClick={onNavigateToBooking}
          className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-all duration-300 font-medium transform hover:scale-105"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DesktopNav;