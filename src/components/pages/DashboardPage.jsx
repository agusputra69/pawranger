import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCartContext } from '../../contexts/CartContext';
import Header from '../Header';
import Footer from '../Footer';
import GlobalModals from '../GlobalModals';
import LoadingScreen from '../LoadingScreen';
import { LazyDashboard } from '../LazyComponents';

function DashboardPageRoute() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const { items: cartItems } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);
  const handleOpenAuth = () => setIsAuthModalOpen(true);
  const handleCloseAuth = () => setIsAuthModalOpen(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state and redirect
      // This handles network failures gracefully
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      navigate('/');
      // Optionally show a toast notification about the logout issue
    }
  };

  const handleNavigateToShop = () => {
    navigate('/shop');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateToBooking = () => {
    navigate('/booking');
  };

  return (
    <>
      <Header 
        cartItemsCount={(cartItems || []).reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={handleOpenCart}
        user={user}
        onLogin={handleOpenAuth}
        onLogout={handleLogout}
      />
      
      <Suspense fallback={<LoadingScreen message="Loading Dashboard..." />}>
        <LazyDashboard
          onNavigateHome={handleNavigateHome}
          onNavigateToShop={handleNavigateToShop}
          onNavigateToBooking={handleNavigateToBooking}
        />
      </Suspense>
      
      <Footer />
      
      <GlobalModals
        isCartOpen={isCartOpen}
        onCloseCart={handleCloseCart}
        isAuthModalOpen={isAuthModalOpen}
        onCloseAuth={handleCloseAuth}
      />
    </>
  );
}

export default DashboardPageRoute;