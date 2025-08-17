/* eslint-disable react-refresh/only-export-components */
// Export all context providers and hooks
export { AuthProvider, useAuthContext, AuthContext } from './AuthContext';
export { CartProvider, useCartContext, CartContext } from './CartContext';
export { ProductsProvider, useProductsContext, ProductsContext } from './ProductsContext';

// Combined provider component for easier setup
import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { ProductsProvider } from './ProductsContext';

/**
 * Combined provider that wraps all context providers
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Combined provider component
 */
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
};