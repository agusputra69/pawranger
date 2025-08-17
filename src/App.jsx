import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PetFoodLanding from './components/PetFoodLanding';
import Services from './components/Services';
import Shop from './components/Shop';
import Gallery from './components/Gallery';
import AdminLogin from './admin/components/AdminLogin';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { AdminProvider } from './admin/contexts/AdminContext';
import { AppProviders } from './contexts';
import { useAuthContext } from './contexts/AuthContext';
import { useCartContext } from './contexts/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import { FullPageLoader } from './components/LoadingBoundary';
import GlobalModals from './components/GlobalModals';
import LoadingScreen from './components/LoadingScreen';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import AdminRouter from './admin/components/AdminRouter';
import {
  LazyShop,
  LazyEcommercePage,
  LazyServices,
  LazyBookingSystem,
  LazyCheckoutPage,
  LazyOrderHistory,
  LazyUserDashboard,
  LazyAdminDashboard,
  LazyOrderManagement,
  LazyUserManagement
} from './components/LazyComponents';

// Home page component
function HomePage() {
  const { user, signOut } = useAuthContext()
  const { items: cartItems, addItem: addToCart } = useCartContext()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleOpenCart = () => setIsCartOpen(true)
  const handleCloseCart = () => setIsCartOpen(false)
  const handleOpenAuth = () => setIsAuthModalOpen(true)
  const handleCloseAuth = () => setIsAuthModalOpen(false)

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <>
      <Header 
        cartItemsCount={(cartItems || []).reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={handleOpenCart}
        user={user}
        onLogin={handleOpenAuth}
        onLogout={handleLogout}
      />
      <main>
        <Hero />
        <Services />
        <PetFoodLanding />
        <Shop 
          cartItems={cartItems}
          addToCart={addToCart}
          onOpenCart={handleOpenCart}
        />
        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      
      <GlobalModals
        isCartOpen={isCartOpen}
        onCloseCart={handleCloseCart}
        isAuthModalOpen={isAuthModalOpen}
        onCloseAuth={handleCloseAuth}
      />
    </>
  )
}

/**
 * Main App component that provides global context and routing
 */
function AppContent() {
  const { isLoading: isCheckingAuth } = useAuthContext()

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return <LoadingScreen message="Loading..." />
  }

  return (
    <div className="min-h-screen bg-white">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={
            <Suspense fallback={<LoadingScreen message="Loading Shop..." />}>
              <LazyEcommercePage />
            </Suspense>
          } />
          <Route path="/booking" element={
            <Suspense fallback={<LoadingScreen message="Loading Booking System..." />}>
              <LazyBookingSystem />
            </Suspense>
          } />
          <Route path="/checkout" element={
            <Suspense fallback={<LoadingScreen message="Loading Checkout..." />}>
              <LazyCheckoutPage />
            </Suspense>
          } />
          <Route path="/dashboard" element={
            <Suspense fallback={<LoadingScreen message="Loading Dashboard..." />}>
              <LazyUserDashboard />
            </Suspense>
          } />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminRouter />
            </ProtectedAdminRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  )
}

/**
 * Root App component with providers
 */
function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AppProviders>
          <AppContent />
        </AppProviders>
      </AdminProvider>
    </ErrorBoundary>
  )
}

export default App
