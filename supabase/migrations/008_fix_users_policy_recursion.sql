-- Fix infinite recursion in users table RLS policies
-- Drop the problematic admin policy that causes circular reference

-- Drop the existing admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create a safer admin policy using auth metadata instead of querying users table
-- This checks the user's role from auth.jwt() claims to avoid circular reference
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    (auth.jwt() ->> 'role')::text = 'admin'
    OR 
    auth.uid() = id
  );

-- Alternative approach: Create a function that checks admin status without querying users table
-- This uses a direct check against auth metadata
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin role in their JWT claims
  RETURN (auth.jwt() ->> 'role')::text = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;