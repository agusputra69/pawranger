import { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin, Clock, ShoppingBag, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';

const Header = ({ 
  cartItemsCount = 0, 
  onOpenCart, 
  onNavigateToBooking, 
  onNavigateToEcommerce,
  user,
  onLogin,
  onLogout,
  onNavigateToDashboard
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Smooth scroll function
  const smoothScroll = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
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
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2 px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Jakarta, Indonesia</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Buka: 08:00 - 20:00 WIB</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl py-2' 
          : 'bg-white shadow-lg py-0'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐾</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Pawranger</h1>
                <p className="text-xs text-gray-600">Pet Care & Grooming</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => smoothScroll('home')} 
                className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105"
              >
                Beranda
              </button>
              <button 
                onClick={() => smoothScroll('services')} 
                className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105"
              >
                Layanan
              </button>
              <button 
                onClick={onNavigateToEcommerce} 
                className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-1"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop</span>
              </button>
              
              {/* Info Dropdown */}
              <div className="relative info-dropdown">
                <button 
                  onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-1"
                >
                  <span>Info</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isInfoDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isInfoDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button 
                      onClick={() => {
                        smoothScroll('about');
                        setIsInfoDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    >
                      Tentang Kami
                    </button>
                    <button 
                      onClick={() => {
                        smoothScroll('gallery');
                        setIsInfoDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    >
                      Galeri
                    </button>
                    <button 
                      onClick={() => {
                        smoothScroll('contact');
                        setIsInfoDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                    >
                      Kontak
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* CTA Button & Cart */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart Button */}
              <button 
                onClick={onOpenCart}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              
              {/* User Authentication */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={onNavigateToDashboard}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onLogin}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
              
              <button 
                onClick={onNavigateToBooking}
                className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors font-medium"
              >
                Booking Sekarang
              </button>
            </div>

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

          {/* Mobile Navigation */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => smoothScroll('home')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2"
                >
                  Beranda
                </button>
                <button
                  onClick={() => smoothScroll('services')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2"
                >
                  Layanan
                </button>
                <button
                onClick={onNavigateToEcommerce}
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
                        Tentang Kami
                      </button>
                      <button
                        onClick={() => {
                          smoothScroll('gallery');
                          setIsMenuOpen(false);
                        }}
                        className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2 block"
                      >
                        Galeri
                      </button>
                      <button
                        onClick={() => {
                          smoothScroll('contact');
                          setIsMenuOpen(false);
                        }}
                        className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-300 text-left hover:translate-x-2 block"
                      >
                        Kontak
                      </button>
                    </div>
                  </div>
                </div>
                {/* Mobile Cart & User */}
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={onOpenCart}
                    className="relative p-3 text-gray-700 hover:text-primary-600 transition-colors border border-gray-300 rounded-full flex-1 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Keranjang</span>
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
                      onClick={onLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors p-3 border border-red-300 rounded-full w-full justify-center"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={onLogin}
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
                  Booking Sekarang
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;