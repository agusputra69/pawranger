# Component Documentation - Pawranger Website

## Overview

This document provides detailed information about all React components in the Pawranger website, including their props, functionality, and usage examples.

## Core Components

### App.jsx

**Purpose:** Main application component that manages global state and routing.

**State Management:**
- `currentPage`: Current active page/view
- `cartItems`: Shopping cart items array
- `isCartOpen`: Cart modal visibility
- `user`: Current authenticated user
- `isAuthModalOpen`: Authentication modal visibility
- `orders`: User order history

**Key Functions:**
- `addToCart(product)`: Adds product to cart
- `updateCartQuantity(id, quantity)`: Updates item quantity
- `removeFromCart(id)`: Removes item from cart
- `handleLogin(userData)`: Processes user login
- `handleLogout()`: Processes user logout
- `handleCheckout(orderData)`: Processes order creation

### Header.jsx

**Purpose:** Navigation header with responsive design and user authentication.

**Props:**
```typescript
interface HeaderProps {
  cartItemsCount: number;
  onOpenCart: () => void;
  onNavigateToBooking: () => void;
  onNavigateToEcommerce: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
}
```

**Features:**
- Responsive navigation with mobile menu
- Grouped "Info" dropdown (Tentang Kami, Galeri, Kontak)
- User authentication status display
- Shopping cart integration
- Smooth scroll navigation

**State:**
- `isMenuOpen`: Mobile menu visibility
- `isScrolled`: Header scroll state for styling
- `isInfoDropdownOpen`: Desktop info dropdown state
- `isMobileInfoOpen`: Mobile info section state

### EcommercePage.jsx

**Purpose:** Main e-commerce interface with product catalog and filtering.

**Props:**
```typescript
interface EcommercePageProps {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  onCheckout: (orderData: OrderData) => void;
  user: User | null;
}
```

**Features:**
- Product catalog with categories
- Advanced filtering and search
- Grid/list view toggle
- Pagination
- Wishlist functionality
- Price range filtering
- Brand filtering

**State:**
- `selectedCategory`: Current product category
- `searchTerm`: Search query
- `wishlist`: Wishlist items array
- `viewMode`: Display mode (grid/list)
- `sortBy`: Sort criteria
- `priceRange`: Price filter range
- `selectedBrands`: Selected brand filters
- `showFilters`: Filter panel visibility
- `currentPage`: Current pagination page

### CartModal.jsx

**Purpose:** Shopping cart modal with item management.

**Props:**
```typescript
interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  onNavigateToEcommerce: () => void;
  onCheckout: () => void;
}
```

**Features:**
- Item quantity management
- Price calculations
- Remove items functionality
- Checkout navigation
- Empty cart state

### AuthModal.jsx

**Purpose:** User authentication modal with login/register forms.

**Props:**
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: LoginData) => void;
}
```

**Features:**
- Login/register form toggle
- Form validation
- Error handling
- Responsive design

**State:**
- `isLogin`: Toggle between login/register
- `formData`: Form input data
- `errors`: Validation errors
- `isLoading`: Submission state

### CheckoutPage.jsx

**Purpose:** Multi-step checkout process with payment integration.

**Props:**
```typescript
interface CheckoutPageProps {
  cartItems: CartItem[];
  user: User | null;
  onOrderComplete: (orderData: OrderData) => void;
  onNavigateHome: () => void;
}
```

**Features:**
- Multi-step checkout flow
- Customer information form
- Payment method selection
- Order summary
- Payment proof upload
- Order confirmation

**State:**
- `currentStep`: Current checkout step
- `customerInfo`: Customer form data
- `paymentMethod`: Selected payment method
- `paymentProof`: Uploaded payment file
- `isProcessing`: Order processing state

### UserDashboard.jsx

**Purpose:** User profile and order management dashboard.

**Props:**
```typescript
interface UserDashboardProps {
  user: User;
  orders: Order[];
  onNavigateHome: () => void;
  onLogout: () => void;
}
```

**Features:**
- User profile display
- Order history
- Order status tracking
- Profile editing
- Logout functionality

**State:**
- `activeTab`: Current dashboard tab
- `isEditing`: Profile edit mode
- `editData`: Profile edit form data

### BookingSystem.jsx

**Purpose:** Service booking interface with form validation.

**Props:**
```typescript
interface BookingSystemProps {
  onBookingComplete: (bookingData: BookingData) => void;
}
```

**Features:**
- Service selection
- Date/time picker
- Pet information form
- Customer details form
- Booking confirmation

**State:**
- `selectedService`: Chosen service
- `selectedDate`: Booking date
- `selectedTime`: Booking time
- `petInfo`: Pet details
- `customerInfo`: Customer details
- `isSubmitting`: Form submission state

## Layout Components

### Hero.jsx

**Purpose:** Landing page hero section with call-to-action.

**Props:**
```typescript
interface HeroProps {
  onNavigateToBooking: () => void;
  onNavigateToEcommerce: () => void;
}
```

**Features:**
- Animated hero content
- CTA buttons
- Responsive design
- Background animations

### Services.jsx

**Purpose:** Services showcase section.

**Props:**
```typescript
interface ServicesProps {
  onNavigateToBooking: () => void;
}
```

**Features:**
- Service cards display
- Hover animations
- Service descriptions
- Booking integration

### About.jsx

**Purpose:** About section with company information.

**Features:**
- Company story
- Team information
- Mission and values
- Statistics display

### Gallery.jsx

**Purpose:** Image gallery showcase.

**Features:**
- Image grid layout
- Lightbox functionality
- Category filtering
- Responsive image display

### Contact.jsx

**Purpose:** Contact information and form.

**Features:**
- Contact form
- Business information
- Map integration
- Social media links

### Footer.jsx

**Purpose:** Site footer with links and information.

**Features:**
- Navigation links
- Contact information
- Social media links
- Copyright information

## Utility Components

### Shop.jsx

**Purpose:** Shop preview section on landing page.

**Props:**
```typescript
interface ShopProps {
  onNavigateToEcommerce: () => void;
}
```

**Features:**
- Featured products display
- Shop navigation
- Product previews

### PetFoodLanding.jsx

**Purpose:** Pet food product showcase.

**Props:**
```typescript
interface PetFoodLandingProps {
  onNavigateToEcommerce: () => void;
}
```

**Features:**
- Product highlights
- Category showcase
- Brand partnerships

### OrderHistory.jsx

**Purpose:** Order history display component.

**Props:**
```typescript
interface OrderHistoryProps {
  orders: Order[];
}
```

**Features:**
- Order list display
- Status indicators
- Order details
- Date formatting

## Component Patterns

### State Management
- Use `useState` for local component state
- Props drilling for shared state
- Centralized state in App.jsx

### Event Handling
- Consistent naming: `onAction` for props, `handleAction` for internal
- Event delegation for performance
- Proper cleanup in useEffect

### Styling
- Tailwind CSS utility classes
- Responsive design patterns
- Consistent color scheme
- Hover and transition effects

### Form Handling
- Controlled components
- Validation on submit
- Error state management
- Loading states

## Best Practices

### Performance
- Lazy loading for large components
- Memoization for expensive calculations
- Proper key props for lists
- Image optimization

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility

### Code Organization
- Single responsibility principle
- Consistent file structure
- Clear prop interfaces
- Comprehensive error handling

### Testing Considerations
- Component isolation
- Mock external dependencies
- Test user interactions
- Validate prop requirements