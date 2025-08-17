import { supabase } from '../../lib/supabase';

/**
 * Utility functions for admin user setup and management
 */

/**
 * Check if admin users exist in both admin_users table and Supabase auth
 * @returns {Promise<Object>} Status of admin users
 */
export const checkAdminUsersStatus = async () => {
  try {
    // Get all active admin users from admin_users table
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, name, role')
      .eq('is_active', true);

    if (adminError) {
      throw adminError;
    }

    const status = {
      totalAdmins: adminUsers?.length || 0,
      adminUsers: adminUsers || [],
      needsSetup: adminUsers?.length > 0
    };

    return { success: true, data: status };
  } catch (error) {
    console.error('Error checking admin users status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get setup instructions for admin users
 * @returns {Promise<Object>} Setup instructions
 */
export const getAdminSetupInstructions = async () => {
  try {
    const statusResult = await checkAdminUsersStatus();
    
    if (!statusResult.success) {
      throw new Error(statusResult.error);
    }

    const { adminUsers } = statusResult.data;
    
    const instructions = {
      message: 'Admin users found in database but may need Supabase auth accounts',
      steps: [
        '1. Go to Supabase Dashboard > Authentication > Users',
        '2. Create auth users for each admin email below:',
        ...adminUsers.map(admin => `   - ${admin.email} (${admin.role})`),
        '3. Use temporary password "admin123" for initial setup',
        '4. Admin users should change password on first login',
        '5. Alternative: Use Supabase CLI to create users programmatically'
      ],
      adminEmails: adminUsers.map(admin => admin.email)
    };

    return { success: true, data: instructions };
  } catch (error) {
    console.error('Error getting setup instructions:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Validate admin credentials format
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Object} Validation result
 */
export const validateAdminCredentials = (email, password) => {
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!password || !password.trim()) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Enhanced error messages for admin authentication
 * @param {Error} error - The authentication error
 * @returns {string} User-friendly error message
 */
export const getAuthErrorMessage = (error) => {
  const errorMessage = error?.message?.toLowerCase() || '';

  if (errorMessage.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (errorMessage.includes('email not confirmed')) {
    return 'Please check your email and confirm your account before logging in.';
  }
  
  if (errorMessage.includes('too many requests')) {
    return 'Too many login attempts. Please wait a few minutes before trying again.';
  }
  
  if (errorMessage.includes('invalid admin credentials')) {
    return 'Access denied. This account does not have admin privileges.';
  }
  
  if (errorMessage.includes('authentication failed')) {
    return 'Authentication failed. Please contact your system administrator.';
  }

  // Default error message
  return 'Login failed. Please check your credentials and try again.';
};