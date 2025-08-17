import React from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { useCartContext } from '../contexts/CartContext'
import CartModal from './CartModal'
import AuthModal from './AuthModal'
import Toast from './Toast'

/**
 * GlobalModals manages all application-wide modals and notifications
 */
function GlobalModals({ 
  isCartOpen, 
  onCloseCart, 
  isAuthModalOpen, 
  onCloseAuth, 
  onNavigate 
}) {
  const { signIn } = useAuthContext()
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    error: cartError, 
    isLoading: isCartLoading,
    clearError 
  } = useCartContext()

  const handleLogin = async (userData) => {
    try {
      await signIn(userData)
      onCloseAuth()
      // Redirect to dashboard after successful login
      if (onNavigate) {
        onNavigate('dashboard')
      }
    } catch (error) {
      console.error('Login failed:', error)
      // Error handling is managed by AuthModal component
    }
  }

  const handleCheckout = () => {
    onCloseCart()
    onNavigate('checkout')
  }

  const handleNavigateToEcommerce = () => {
    onCloseCart()
    onNavigate('ecommerce')
  }

  return (
    <>
      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={onCloseCart}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onNavigateToEcommerce={handleNavigateToEcommerce}
        onCheckout={handleCheckout}
        isLoading={isCartLoading}
      />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuth}
        onLogin={handleLogin}
      />
      
      {/* Toast Notifications */}
      <Toast 
        message={cartError}
        type="error"
        isVisible={!!cartError}
        onClose={clearError}
        duration={5000}
      />
    </>
  )
}

export default GlobalModals