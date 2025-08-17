import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCartContext } from '../../contexts/CartContext';
import Header from '../Header';
import Footer from '../Footer';
import GlobalModals from '../GlobalModals';
import LoadingScreen from '../LoadingScreen';
import { LazyAdminLogin } from '../LazyComponents';

function AdminLoginPageRoute() {
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
    await signOut();
    navigate('/');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleAdminLoginSuccess = () => {
    navigate('/admin/dashboard');
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
      
      <Suspense fallback={<LoadingScreen message="Loading Admin Login..." />}>
        <LazyAdminLogin
          onNavigateHome={handleNavigateHome}
          onLoginSuccess={handleAdminLoginSuccess}
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

export default AdminLoginPageRoute;