-- Create admin users in Supabase auth if they don't exist
-- This migration ensures admin users from admin_users table also exist in auth.users

-- Note: This is a SQL script that needs to be run manually or through Supabase CLI
-- as we cannot directly insert into auth.users table from SQL

-- First, let's create a function to help with admin user management
CREATE OR REPLACE FUNCTION create_admin_auth_user(
  admin_email TEXT,
  admin_password TEXT DEFAULT 'admin123'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_exists BOOLEAN;
  admin_record RECORD;
BEGIN
  -- Check if admin exists in admin_users table
  SELECT * INTO admin_record
  FROM admin_users
  WHERE email = admin_email AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN 'Admin user not found in admin_users table: ' || admin_email;
  END IF;
  
  -- Note: In a real scenario, you would need to use Supabase CLI or API
  -- to create auth users. This function serves as documentation.
  
  RETURN 'Admin user found: ' || admin_email || '. Please create auth user manually.';
END;
$$;

-- Get all active admin users that need auth accounts
SELECT 
  email,
  name,
  role,
  'Please create auth user for: ' || email AS instruction
FROM admin_users 
WHERE is_active = true
ORDER BY created_at;

-- Instructions for manual creation:
-- 1. Use Supabase Dashboard > Authentication > Users
-- 2. Create users with emails from the query above
-- 3. Use temporary password 'admin123' (users should change on first login)
-- 4. Or use Supabase CLI: supabase auth create-user --email=admin@example.com --password=admin123