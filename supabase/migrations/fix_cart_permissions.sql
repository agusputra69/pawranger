-- Check current permissions for cart table
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'cart' 
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- Grant necessary permissions to cart table
GRANT SELECT, INSERT, UPDATE, DELETE ON cart TO authenticated;
GRANT SELECT ON cart TO anon;

-- Verify permissions after granting
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'cart' 
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;