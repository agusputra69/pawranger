-- Fix infinite recursion in admin_users table RLS policies
-- The current policies cause circular reference by querying admin_users within admin_users policies

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin users can view admin data" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view activity logs" ON admin_activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity logs" ON admin_activity_logs;

-- Create safer policies that don't cause circular references
-- Use auth.uid() directly instead of querying admin_users table

-- Allow admin users to view their own data
CREATE POLICY "Admin users can view own data" ON admin_users
    FOR SELECT USING (id = auth.uid()::uuid);

-- Allow admin users to update their own profile
CREATE POLICY "Admin users can update own profile" ON admin_users
    FOR UPDATE USING (id = auth.uid()::uuid);

-- Create a function to check admin status without circular reference
-- This function will be used by other tables that need admin checks
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the current user exists in admin_users and is active
    -- This is safe to use in other table policies but not in admin_users policies
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid()::uuid 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- For admin_activity_logs, use direct auth.uid() checks
CREATE POLICY "Admin activity logs access" ON admin_activity_logs
    FOR ALL USING (admin_id = auth.uid()::uuid);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;