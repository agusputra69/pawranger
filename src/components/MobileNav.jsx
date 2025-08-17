import React, { useState } from 'react';
import { ShoppingBag, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';

const MobileNav = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
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
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);

  return (
    <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
      isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <div className="py-4 border-t border-gray-200">
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => smoothScroll('home')}
            className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2"
          >
            Home
          </button>
          <button
            onClick={() => smoothScroll('services')}
            className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2"
          >
            Services
          </button>
          <button
            onClick={() => {
              onNavigateToEcommerce();
              setIsMenuOpen(false);
            }}
            className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2 flex items-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop</span>
          </button>
          
          {/* Mobile Info Section */}
          <div>
            <button
              onClick={() => setIsMobileInfoOpen(!isMobileInfoOpen)}
              className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2 flex items-center space-x-2 w-full"
            >
              <span>Info</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileInfoOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Mobile Info Dropdown */}
            <div className={`overflow-hidden transition-all duration-300 ${isMobileInfoOpen ? 'max-h-32 mt-2' : 'max-h-0'}`}>
              <div className="pl-4 space-y-2">
                <button
                  onClick={() => {
                    smoothScroll('about');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2 block"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    smoothScroll('gallery');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2 block"
                >
                  Gallery
                </button>
                <button
                  onClick={() => {
                    smoothScroll('contact');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2 block"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Cart & User */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={openCart}
              className={`relative p-3 transition-colors border rounded-full flex-1 flex items-center justify-center space-x-2 ${
                isCartLoading 
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                  : cartError 
                  ? 'text-red-500 border-red-300 hover:text-red-600' 
                  : 'text-gray-700 border-gray-300 hover:text-primary-600'
              }`}
              disabled={isCartLoading}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isCartLoading ? 'Loading...' : 'Cart'}</span>
              {cartItemsCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile User Authentication */}
          {user ? (
            <div className="space-y-3">
              <button 
                onClick={onNavigateToDashboard}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors p-3 border border-gray-300 rounded-full w-full justify-center"
              >
                <User className="w-5 h-5" />
                <span>{user.name}</span>
              </button>
              <button 
                onClick={logout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors p-3 border border-red-300 rounded-full w-full justify-center"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors p-3 border border-gray-300 rounded-full w-full justify-center"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </button>
          )}
          
          <button 
            onClick={onNavigateToBooking}
            className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all duration-300 font-medium w-full transform hover:scale-105"
          >
            Book Now
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;