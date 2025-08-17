/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuthContext } from './AuthContext';

// Create the context
const CartContext = createContext(null);

/**
 * Custom hook to use the CartContext
 * @returns {Object} Cart context value
 */
export const useCartContext = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  
  return context;
};

/**
 * CartProvider component that provides cart state and methods
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} CartProvider component
 */
export const CartProvider = ({ children }) => {
  const { user } = useAuthContext();
  const cart = useCart(user);

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};

// Export the context for advanced use cases
export { CartContext };