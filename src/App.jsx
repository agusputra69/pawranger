import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import PetFoodLanding from './components/PetFoodLanding'
import Shop from './components/Shop'
import About from './components/About'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BookingSystem from './components/BookingSystem'
import EcommercePage from './components/EcommercePage'
import CartModal from './components/CartModal'
import CheckoutPage from './components/CheckoutPage'
import AuthModal from './components/AuthModal'
import UserDashboard from './components/UserDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('pawranger_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('pawranger_user')
      }
    }
    setIsCheckingAuth(false)
  }, [])

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId))
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const navigateToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('pawranger_user', JSON.stringify(userData))
    setIsAuthModalOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('pawranger_user')
    navigateToPage('home')
  }

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    navigateToPage('checkout')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'booking':
        return <BookingSystem user={user} onLogin={() => setIsAuthModalOpen(true)} />
      case 'ecommerce':
        return (
          <EcommercePage
            cartItems={cartItems}
            addToCart={addToCart}
            onOpenCart={() => setIsCartOpen(true)}
            onNavigateHome={() => navigateToPage('home')}
            onCheckout={handleCheckout}
            user={user}
          />
        )
      case 'checkout':
        return (
          <CheckoutPage
            cartItems={cartItems}
            user={user}
            onNavigateBack={() => navigateToPage('ecommerce')}
            onOrderComplete={() => {
              setCartItems([])
              navigateToPage('dashboard')
            }}
          />
        )
      case 'dashboard':
        return (
          <UserDashboard
            user={user}
            onNavigateToEcommerce={() => navigateToPage('ecommerce')}
            onNavigateToBooking={() => navigateToPage('booking')}
            onLogout={handleLogout}
          />
        )
      default:
        return (
          <>
            <Header 
              cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              onOpenCart={() => setIsCartOpen(true)}
              onNavigateToBooking={() => navigateToPage('booking')}
              onNavigateToEcommerce={() => navigateToPage('ecommerce')}
              user={user}
              onLogin={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
              onNavigateToDashboard={() => navigateToPage('dashboard')}
            />
            <main>
              <Hero onNavigateToBooking={() => navigateToPage('booking')} />
              <Services onNavigateToBooking={() => navigateToPage('booking')} />
              <PetFoodLanding onNavigateToEcommerce={() => navigateToPage('ecommerce')} />
              <Shop 
                cartItems={cartItems}
                addToCart={addToCart}
                onOpenCart={() => setIsCartOpen(true)}
                onNavigateToEcommerce={() => navigateToPage('ecommerce')}
              />
              <About />
              <Gallery />
              <Contact />
            </main>
            <Footer />
          </>
        )
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {renderPage()}
      
      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateCartQuantity}
        removeItem={removeFromCart}
        onNavigateToEcommerce={() => {
          setIsCartOpen(false)
          navigateToPage('ecommerce')
        }}
        onCheckout={() => {
          setIsCartOpen(false)
          handleCheckout()
        }}
      />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default App
