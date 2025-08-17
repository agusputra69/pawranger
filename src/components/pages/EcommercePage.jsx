import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCartContext } from '../../contexts/CartContext';
import Header from '../Header';
import Footer from '../Footer';
import GlobalModals from '../GlobalModals';
import LoadingScreen from '../LoadingScreen';
import { LazyEcommercePage } from '../LazyComponents';

function EcommercePageRoute() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const { items: cartItems, addToCart } = useCartContext();
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

  const handleCheckout = () => {
    if (!user) {
      handleOpenAuth();
      return;
    }
    navigate('/checkout');
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
      
      <Suspense fallback={<LoadingScreen message="Loading Shop..." />}>
        <LazyEcommercePage
          onOpenCart={handleOpenCart}
          onNavigateHome={() => navigate('/')}
          onCheckout={handleCheckout}
          addToCart={addToCart}
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

export default EcommercePageRoute;