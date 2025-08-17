import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { smoothScrollTo } from '../utils';
import { useCartContext } from '../contexts/CartContext';
import TopBar from './TopBar';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Header = ({ 
  cartItemsCount,
  onOpenCart,
  user,
  onLogin,
  onLogout
}) => {
  const navigate = useNavigate();
  const { cartItems, openCart, isLoading: isCartLoading, error: cartError } = useCartContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);

  const actualCartItemsCount = cartItemsCount || cartItems?.length || 0;

  const handleNavigateToEcommerce = () => navigate('/shop');
  const handleNavigateToBooking = () => navigate('/booking');
  const handleNavigateToDashboard = () => {
    if (!user) {
      onLogin();
      return;
    }
    navigate('/dashboard');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const smoothScroll = (elementId) => {
    smoothScrollTo(elementId);
    setIsMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isInfoDropdownOpen && !event.target.closest('.info-dropdown')) {
        setIsInfoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isInfoDropdownOpen]);

  return (
    <>
      <TopBar />

      
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">PawRanger</h1>
                <p className="text-sm text-gray-600">Premium Pet Care</p>
              </div>
            </div>

            <DesktopNav 
              onNavigateToEcommerce={handleNavigateToEcommerce}
              onNavigateToBooking={handleNavigateToBooking}
              onNavigateToDashboard={handleNavigateToDashboard}
              smoothScroll={smoothScroll}
              user={user}
              login={onLogin}
              logout={onLogout}
              openCart={onOpenCart || openCart}
              cartItemsCount={actualCartItemsCount}
              isCartLoading={isCartLoading}
              cartError={cartError}
            />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          <MobileNav 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigateToEcommerce={handleNavigateToEcommerce}
            onNavigateToBooking={handleNavigateToBooking}
            onNavigateToDashboard={handleNavigateToDashboard}
            smoothScroll={smoothScroll}
            user={user}
            login={onLogin}
            logout={onLogout}
            openCart={onOpenCart || openCart}
            cartItemsCount={actualCartItemsCount}
            isCartLoading={isCartLoading}
            cartError={cartError}
          />
        </div>
      </header>
    </>
  );
};

export default memo(Header);