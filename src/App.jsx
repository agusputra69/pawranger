import { useState, useEffect, Suspense } from 'react'
import { supabase, signOut, getCurrentUser, getCartItems, addToCart as addToSupabaseCart, updateCartItem, removeFromCart as removeFromSupabaseCart, clearCart, syncLocalCartToSupabase } from './lib/supabase'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import PetFoodLanding from './components/PetFoodLanding'
import Shop from './components/Shop'
import About from './components/About'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CartModal from './components/CartModal'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import { LazyEcommercePage, LazyCheckoutPage, LazyUserDashboard, LazyBookingSystem, LazyGallery, LazyAbout } from './components/LazyComponents'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [cartError, setCartError] = useState(null)
  const [isCartLoading, setIsCartLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Load cart from localStorage for guests
  useEffect(() => {
    const savedCart = localStorage.getItem('pawranger_cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem('pawranger_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, user])

  // Load cart from Supabase for authenticated users
  const loadCartFromSupabase = async () => {
    try {
      const { data: cartData, error } = await getCartItems()
      if (error) throw error
      
      if (cartData && cartData.length > 0) {
        const cartItems = cartData.map(item => ({
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image: item.products.image_url,
          brand: item.products.brand,
          category: item.products.category,
          weight: item.products.weight,
          quantity: item.quantity,
          inStock: item.products.stock_quantity,
          cartItemId: item.id // Store the cart table ID for updates
        }))
        setCartItems(cartItems)
      }
    } catch (error) {
      console.error('Error loading cart from Supabase:', error)
    }
  }

  // Check for existing user session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getCurrentUser()
      if (user) {
        const userData = {
          id: user.id,
          name: user.user_metadata?.name || user.email.split('@')[0],
          email: user.email,
          phone: user.user_metadata?.phone || '',
          isLoggedIn: true
        }
        setUser(userData)
        
        // Sync local cart to Supabase and load user's cart
        const localCart = JSON.parse(localStorage.getItem('pawranger_cart') || '[]')
        if (localCart.length > 0) {
          await syncLocalCartToSupabase(localCart)
          localStorage.removeItem('pawranger_cart')
        }
        await loadCartFromSupabase()
      }
      setIsCheckingAuth(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0],
          email: session.user.email,
          phone: session.user.user_metadata?.phone || '',
          isLoggedIn: true
        }
        setUser(userData)
        
        // Sync local cart to Supabase and load user's cart
        const localCart = JSON.parse(localStorage.getItem('pawranger_cart') || '[]')
        if (localCart.length > 0) {
          await syncLocalCartToSupabase(localCart)
          localStorage.removeItem('pawranger_cart')
        }
        await loadCartFromSupabase()
      } else {
        setUser(null)
        // Clear cart when user logs out
        setCartItems([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const addToCart = async (product, quantity = 1) => {
    setCartError(null)
    setIsCartLoading(true)
    
    if (user) {
      // Add to Supabase cart for authenticated users
      const { error } = await addToSupabaseCart(product.id, quantity)
      if (error) {
        console.error('Error adding to cart:', error)
        const errorMessage = 'Failed to add item to cart. Please try again.'
        setCartError(errorMessage)
        setShowToast(true)
        setIsCartLoading(false)
        return
      }
      // Reload cart from Supabase
      await loadCartFromSupabase()
    } else {
      // Add to local cart for guests
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
    
    setIsCartLoading(false)
  }

  const updateCartQuantity = async (productId, newQuantity) => {
    setCartError(null)
    setIsCartLoading(true)
    
    if (user) {
      // Update Supabase cart for authenticated users
      const cartItem = cartItems.find(item => item.id === productId)
      if (cartItem?.cartItemId) {
        const { error } = await updateCartItem(cartItem.cartItemId, newQuantity)
        if (error) {
          console.error('Error updating cart:', error)
          const errorMessage = 'Failed to update cart. Please try again.'
          setCartError(errorMessage)
          setShowToast(true)
          setIsCartLoading(false)
          return
        }
        // Reload cart from Supabase
        await loadCartFromSupabase()
      }
    } else {
      // Update local cart for guests
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
    
    setIsCartLoading(false)
  }

  const removeFromCart = async (productId) => {
    setCartError(null)
    setIsCartLoading(true)
    
    if (user) {
      // Remove from Supabase cart for authenticated users
      const cartItem = cartItems.find(item => item.id === productId)
      if (cartItem?.cartItemId) {
        const { error } = await removeFromSupabaseCart(cartItem.cartItemId)
        if (error) {
          console.error('Error removing from cart:', error)
          const errorMessage = 'Failed to remove item from cart. Please try again.'
          setCartError(errorMessage)
          setShowToast(true)
          setIsCartLoading(false)
          return
        }
        // Reload cart from Supabase
        await loadCartFromSupabase()
      }
    } else {
      // Remove from local cart for guests
      setCartItems(prev => prev.filter(item => item.id !== productId))
    }
    
    setIsCartLoading(false)
  }

  const navigateToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
    setUser(null)
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
        return (
          <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Booking System...</p>
              </div>
            </div>
          }>
            <LazyBookingSystem user={user} onLogin={() => setIsAuthModalOpen(true)} />
          </Suspense>
        )
      case 'ecommerce':
        return (
          <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading E-commerce...</p>
              </div>
            </div>
          }>
            <LazyEcommercePage
              cartItems={cartItems}
              addToCart={addToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onNavigateHome={() => navigateToPage('home')}
              onCheckout={handleCheckout}
              user={user}
            />
          </Suspense>
        )
      case 'checkout':
        return (
          <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Checkout...</p>
              </div>
            </div>
          }>
            <LazyCheckoutPage
              cartItems={cartItems}
              user={user}
              onBack={() => navigateToPage('ecommerce')}
              onOrderComplete={async () => {
                if (user) {
                  await clearCart()
                }
                setCartItems([])
                navigateToPage('dashboard')
              }}
            />
          </Suspense>
        )
      case 'dashboard':
        return (
          <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Dashboard...</p>
              </div>
            </div>
          }>
            <LazyUserDashboard
              user={user}
              onNavigateToEcommerce={() => navigateToPage('ecommerce')}
              onNavigateToBooking={() => navigateToPage('booking')}
              onLogout={handleLogout}
            />
          </Suspense>
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
              cartError={cartError}
              isCartLoading={isCartLoading}
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
        
        {/* Toast Notifications */}
        <Toast 
          message={cartError}
          type="error"
          isVisible={showToast && cartError}
          onClose={() => {
            setShowToast(false)
            setCartError(null)
          }}
          duration={5000}
        />
      </div>
  )
}

export default App
