/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { validateAdminCredentials, getAuthErrorMessage } from '../utils/adminSetup';

// Create Admin Context
const AdminContext = createContext();

// Admin state reducer
const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ADMIN':
      return { ...state, admin: action.payload, isAuthenticated: !!action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...state, admin: null, isAuthenticated: false, error: null };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  admin: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Admin Context Provider
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Check if admin is already authenticated on mount
  useEffect(() => {
    checkAdminAuth();
  }, []);

  // Check admin authentication status
  const checkAdminAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (session?.user) {
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .eq('is_active', true)
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          throw adminError;
        }

        if (adminData) {
          dispatch({ type: 'SET_ADMIN', payload: adminData });
          // Update last login
          await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminData.id);
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Admin login function
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Validate credentials format
      const validation = validateAdminCredentials(email, password);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('. '));
      }

      // First, authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Authentication failed');
      }

      // Check if the authenticated user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.trim())
        .eq('is_active', true)
        .single();

      if (adminError || !adminData) {
        // Sign out the user since they're not an admin
        await supabase.auth.signOut();
        throw new Error('Invalid admin credentials');
      }

      dispatch({ type: 'SET_ADMIN', payload: adminData });
      
      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminData.id);
      
      // Log admin activity
      await logAdminActivity(adminData.id, 'login', 'auth', null, { email: email.trim() });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const friendlyMessage = getAuthErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: friendlyMessage });
      return { success: false, error: friendlyMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Admin logout function
  const logout = async () => {
    try {
      if (state.admin) {
        await logAdminActivity(state.admin.id, 'logout', 'auth', null, {});
      }
      
      await supabase.auth.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      // This handles network failures gracefully
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      dispatch({ type: 'LOGOUT' });
      // Don't set error state for network failures during logout
      // as the user should still be logged out locally
    }
  };

  // Log admin activity
  const logAdminActivity = async (adminId, action, resourceType, resourceId = null, details = {}) => {
    try {
      await supabase
        .from('admin_activity_logs')
        .insert({
          admin_id: adminId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          ip_address: null, // Could be populated from request
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  };

  // Check if admin has specific permission
  const hasPermission = (permission) => {
    if (!state.admin) return false;
    if (state.admin.role === 'super_admin') return true;
    return state.admin.permissions?.[permission] === true;
  };

  // Check if admin has specific role
  const hasRole = (role) => {
    if (!state.admin) return false;
    if (Array.isArray(role)) {
      return role.includes(state.admin.role);
    }
    return state.admin.role === role;
  };

  const value = {
    ...state,
    login,
    logout,
    checkAdminAuth,
    logAdminActivity,
    hasPermission,
    hasRole,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;