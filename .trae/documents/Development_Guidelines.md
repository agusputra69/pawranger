# Development Guidelines - Pawranger Website

## Overview

This document outlines the development standards, best practices, and workflows for the Pawranger pet care services website project.

## Code Standards

### JavaScript/React Standards

#### Component Structure
```javascript
// Component imports
import { useState, useEffect } from 'react';
import { Icon1, Icon2 } from 'lucide-react';

// Component definition with props destructuring
const ComponentName = ({ prop1, prop2, onAction }) => {
  // State declarations
  const [state1, setState1] = useState(initialValue);
  const [state2, setState2] = useState(initialValue);

  // Effect hooks
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  // Event handlers
  const handleAction = (event) => {
    // Handler logic
  };

  // Helper functions
  const helperFunction = () => {
    // Helper logic
  };

  // Render
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

#### Naming Conventions
- **Components**: PascalCase (`UserDashboard`, `CartModal`)
- **Files**: PascalCase for components (`UserDashboard.jsx`)
- **Variables/Functions**: camelCase (`isLoading`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Props**: camelCase with descriptive names (`onNavigateToEcommerce`)
- **CSS Classes**: kebab-case or Tailwind utilities

#### Function Naming
- **Event Handlers**: `handle` + `Action` (`handleLogin`, `handleSubmit`)
- **Props Functions**: `on` + `Action` (`onLogin`, `onNavigateHome`)
- **Boolean Variables**: `is` + `State` (`isLoading`, `isVisible`)
- **Getters**: `get` + `Data` (`getTotalPrice`, `getFilteredProducts`)

### State Management

#### Local State
```javascript
// Use useState for component-specific state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});

// Update state immutably
setFormData(prev => ({
  ...prev,
  name: newName
}));
```

#### Shared State
```javascript
// Pass state down through props
const App = () => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <EcommercePage 
      cartItems={cartItems}
      addToCart={addToCart}
    />
  );
};
```

### Error Handling

#### Try-Catch Blocks
```javascript
const handleSubmit = async (formData) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const result = await submitData(formData);
    
    if (result.success) {
      onSuccess(result.data);
    } else {
      setError(result.message);
    }
  } catch (error) {
    console.error('Submission error:', error);
    setError('An unexpected error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

#### Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## Styling Guidelines

### Tailwind CSS Best Practices

#### Responsive Design
```javascript
// Mobile-first approach
<div className="
  w-full p-4
  md:w-1/2 md:p-6
  lg:w-1/3 lg:p-8
  xl:w-1/4
">
```

#### Component Styling
```javascript
// Group related classes
<button className="
  // Layout
  flex items-center justify-center
  px-6 py-3 rounded-full
  
  // Colors
  bg-primary-600 text-white
  hover:bg-primary-700
  
  // Effects
  transition-all duration-300
  transform hover:scale-105
  shadow-lg hover:shadow-xl
">
```

#### Custom CSS Classes
```css
/* Use @apply for reusable component styles */
.btn-primary {
  @apply bg-primary-600 text-white px-6 py-3 rounded-full;
  @apply hover:bg-primary-700 transition-all duration-300;
  @apply transform hover:scale-105 shadow-lg hover:shadow-xl;
}

.card {
  @apply bg-white rounded-2xl p-6 shadow-sm;
  @apply border border-gray-200 hover:shadow-md;
  @apply transition-all duration-300;
}
```

### Color Scheme
```javascript
// Primary colors
const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7', // Main brand color
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};
```

## Performance Guidelines

### Component Optimization

#### React.memo for Pure Components
```javascript
import { memo } from 'react';

const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      {/* Product content */}
    </div>
  );
});

export default ProductCard;
```

#### useCallback for Event Handlers
```javascript
import { useCallback } from 'react';

const ProductList = ({ products, onAddToCart }) => {
  const handleAddToCart = useCallback((product) => {
    onAddToCart(product);
  }, [onAddToCart]);

  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};
```

#### useMemo for Expensive Calculations
```javascript
import { useMemo } from 'react';

const EcommercePage = ({ products, filters }) => {
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Expensive filtering logic
      return matchesFilters(product, filters);
    });
  }, [products, filters]);

  return (
    <ProductList products={filteredProducts} />
  );
};
```

### Image Optimization
```javascript
// Lazy loading images
<img 
  src={product.image}
  alt={product.name}
  loading="lazy"
  className="w-full h-48 object-cover"
/>

// Responsive images
<picture>
  <source media="(min-width: 768px)" srcSet={largeImage} />
  <source media="(min-width: 480px)" srcSet={mediumImage} />
  <img src={smallImage} alt={altText} />
</picture>
```

## Testing Guidelines

### Component Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartModal from '../CartModal';

describe('CartModal', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    cartItems: [
      { id: 1, name: 'Test Product', price: 100, quantity: 2 }
    ],
    updateQuantity: vi.fn(),
    removeItem: vi.fn(),
    onCheckout: vi.fn()
  };

  it('renders cart items correctly', () => {
    render(<CartModal {...mockProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Rp 100.000')).toBeInTheDocument();
  });

  it('calls updateQuantity when quantity is changed', () => {
    render(<CartModal {...mockProps} />);
    
    const increaseButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(increaseButton);
    
    expect(mockProps.updateQuantity).toHaveBeenCalledWith(1, 3);
  });
});
```

### Integration Testing
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('E-commerce Flow', () => {
  it('allows user to add product to cart and checkout', async () => {
    render(<App />);
    
    // Navigate to shop
    fireEvent.click(screen.getByText('Shop'));
    
    // Add product to cart
    const addToCartButton = screen.getAllByText('Add to Cart')[0];
    fireEvent.click(addToCartButton);
    
    // Open cart
    fireEvent.click(screen.getByText('Keranjang'));
    
    // Proceed to checkout
    fireEvent.click(screen.getByText('Checkout'));
    
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
  });
});
```

## Git Workflow

### Branch Naming
- **Feature branches**: `feature/component-name` or `feature/functionality`
- **Bug fixes**: `fix/issue-description`
- **Hotfixes**: `hotfix/critical-issue`
- **Releases**: `release/version-number`

### Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ecommerce): add product filtering functionality

fix(cart): resolve quantity update issue

docs(readme): update installation instructions

style(header): improve responsive navigation
```

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation if needed
4. Create pull request with description
5. Request code review
6. Address review feedback
7. Merge after approval

## Code Review Guidelines

### Review Checklist
- [ ] Code follows naming conventions
- [ ] Components are properly structured
- [ ] State management is appropriate
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Tests are included and passing
- [ ] Documentation is updated

### Review Comments
```javascript
// Good: Specific and constructive
// Consider using useCallback here to prevent unnecessary re-renders
const handleClick = (id) => {
  // ...
};

// Better: Provide solution
// Use useCallback to memoize this handler:
// const handleClick = useCallback((id) => { ... }, [dependency]);
```

## Deployment Guidelines

### Build Process
```bash
# Install dependencies
npm install

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=https://api.pawranger.com
VITE_PAYMENT_GATEWAY_URL=https://payment.pawranger.com
VITE_ANALYTICS_ID=GA_TRACKING_ID
```

### Production Checklist
- [ ] All tests passing
- [ ] Performance audit completed
- [ ] Accessibility audit completed
- [ ] SEO optimization verified
- [ ] Error tracking configured
- [ ] Analytics implemented
- [ ] Security headers configured
- [ ] SSL certificate installed

## Maintenance Guidelines

### Regular Tasks
- Update dependencies monthly
- Review and update documentation
- Monitor performance metrics
- Check for security vulnerabilities
- Backup user data and configurations

### Monitoring
- Application performance
- Error rates and types
- User engagement metrics
- Conversion rates
- Page load times

### Troubleshooting
1. Check browser console for errors
2. Verify network requests
3. Review application logs
4. Test in different browsers
5. Check responsive design
6. Validate form submissions
7. Test user authentication flow