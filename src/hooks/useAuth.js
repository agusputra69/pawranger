import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { storage, errorUtils } from '../utils';
import { SUCCESS_MESSAGES } from '../constants';
import { useLoading } from '../components/LoadingBoundary';

/**
 * Custom hook for managing authentication state and operations
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const { isLoading, error, executeAsync, setError, startLoading, stopLoading } = useLoading(true);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(errorUtils.getErrorMessage(error));
        } else if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError(errorUtils.getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          stopLoading();
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          stopLoading();
          
          // Clear error on successful auth change
          if (session?.user) {
            setError(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [setError, stopLoading]);

  // Sign up with email and password
  const signUp = useCallback(async (email, password, userData = {}) => {
    try {
      const result = await executeAsync(async () => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData
          }
        });
        
        if (error) throw new Error(`Sign up failed: ${error.message}`);
        
        return { success: true, user: data.user };
      });
      
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }, [executeAsync]);

  // Sign in with email and password
  const signIn = useCallback(async (email, password) => {
    try {
      const result = await executeAsync(async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw new Error(`Sign in failed: ${error.message}`);
        
        return { success: true, user: data.user };
      });
      
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }, [executeAsync]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      const result = await executeAsync(async () => {
        const { error } = await supabase.auth.signOut();
        
        if (error) throw new Error(`Sign out failed: ${error.message}`);
        
        // Clear local storage
        storage.remove('user');
        
        return { success: true };
      });
      
      return result;
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }, [executeAsync]);

  // Reset password
  const resetPassword = useCallback(async (email) => {
    startLoading();
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.'
      };
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setError]);



  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    startLoading();
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_UPDATED
      };
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setError]);







  return {
    user,
    loading: isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user,
    setError
  };
};