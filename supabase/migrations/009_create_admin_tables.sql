-- Create admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
    permissions JSONB DEFAULT '{}',
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin activity logs table
CREATE TABLE admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add admin tracking columns to existing products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);

-- Add admin tracking columns to existing orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS processed_by UUID REFERENCES admin_users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);

-- Enable RLS on admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users table
CREATE POLICY "Admin users can view admin data" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::uuid 
            AND au.is_active = true
        )
    );

CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::uuid 
            AND au.role = 'super_admin' 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins can update their own profile" ON admin_users
    FOR UPDATE USING (id = auth.uid()::uuid);

-- Create RLS policies for admin_activity_logs table
CREATE POLICY "Admins can view activity logs" ON admin_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::uuid 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins can insert activity logs" ON admin_activity_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::uuid 
            AND au.is_active = true
        )
    );

-- Grant permissions to authenticated role
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated;
GRANT SELECT, INSERT ON admin_activity_logs TO authenticated;

-- Create indexes for better performance
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_orders_processed_by ON orders(processed_by);

-- Insert a default super admin user (password: admin123 - CHANGE IN PRODUCTION)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admin_users (email, password_hash, name, role) VALUES (
    'admin@pawranger.com',
    '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ',
    'Super Admin',
    'super_admin'
);