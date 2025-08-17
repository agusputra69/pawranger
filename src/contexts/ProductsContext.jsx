/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useProducts } from '../hooks/useProducts';

// Create the context
const ProductsContext = createContext(null);

/**
 * Custom hook to use the ProductsContext
 * @returns {Object} Products context value
 */
export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  
  return context;
};

/**
 * ProductsProvider component that provides products state and methods
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} ProductsProvider component
 */
export const ProductsProvider = ({ children }) => {
  const products = useProducts();

  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
};

// Export the context for advanced use cases
export { ProductsContext };