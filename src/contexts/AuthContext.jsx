/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

// Create the context
const AuthContext = createContext(null);

/**
 * Custom hook to use the AuthContext
 * @returns {Object} Authentication context value
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * AuthProvider component that provides authentication state and methods
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for advanced use cases
export { AuthContext };