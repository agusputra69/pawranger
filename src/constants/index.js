// Application Constants
export const APP_CONFIG = {
  name: 'Pawranger',
  tagline: 'Pet Care & Grooming',
  contact: {
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    address: 'Jl. Kemang Raya No. 123, Jakarta Selatan 12560',
    hours: '08:00 - 20:00 WIB',
    emergencyHours: '24/7'
  }
};

// Cart Configuration
export const CART_CONFIG = {
  localStorageKey: 'pawranger_cart',
  maxRetries: 3,
  retryDelay: 1000
};

// Pagination
export const PAGINATION = {
  itemsPerPage: 9,
  defaultPage: 1
};

// Price Configuration
export const PRICE_CONFIG = {
  currency: 'IDR',
  locale: 'id-ID',
  defaultRange: [0, 1000000]
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🏪' },
  { id: 'dog-food', name: 'Dog Food', icon: '🐕' },
  { id: 'cat-food', name: 'Cat Food', icon: '🐱' },
  { id: 'accessories', name: 'Accessories', icon: '🎾' },
  { id: 'toys', name: 'Toys', icon: '🧸' },
  { id: 'treats', name: 'Treats', icon: '🦴' },
  { id: 'supplements', name: 'Health', icon: '💊' }
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' }
];

// View Modes
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

// Navigation Pages
export const PAGES = {
  HOME: 'home',
  ECOMMERCE: 'ecommerce',
  CHECKOUT: 'checkout',
  DASHBOARD: 'dashboard',
  BOOKING: 'booking',
  GALLERY: 'gallery',
  ABOUT: 'about',
  ADMIN_LOGIN: 'admin-login',
  ADMIN_DASHBOARD: 'admin-dashboard'
};

// Error Messages
export const ERROR_MESSAGES = {
  CART_ADD_FAILED: 'Failed to add item to cart. Please try again.',
  CART_UPDATE_FAILED: 'Failed to update cart. Please try again.',
  CART_REMOVE_FAILED: 'Failed to remove item from cart. Please try again.',
  PRODUCTS_FETCH_FAILED: 'Failed to load products. Please check your connection and try again.',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CART_ITEM_ADDED: 'Item added to cart successfully',
  CART_ITEM_UPDATED: 'Cart updated successfully',
  CART_ITEM_REMOVED: 'Item removed from cart',
  ORDER_PLACED: 'Order placed successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Service Pricing
export const SERVICE_PRICING = {
  GROOMING_BASIC: 'Mulai dari Rp 75.000',
  GROOMING_PREMIUM: 'Mulai dari Rp 100.000',
  BOARDING: 'Mulai dari Rp 50.000/hari',
  PICKUP_DELIVERY: 'Mulai dari Rp 25.000',
  SPA_TREATMENT: 'Mulai dari Rp 150.000'
};

// Order Configuration
export const ORDER_CONFIG = {
  orderPrefix: 'PWR',
  freeShippingThreshold: 200000
};

// File Upload Configuration
export const FILE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  uploadPath: 'payment_proofs'
};

// Business Information
export const BUSINESS_INFO = {
  tagline: '#1 Pet Care di Jakarta',
  serviceArea: 'Jakarta',
  description: 'Pawranger adalah platform terpercaya untuk perawatan hewan peliharaan di Jakarta'
};