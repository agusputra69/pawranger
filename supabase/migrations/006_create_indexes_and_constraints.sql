-- Additional indexes and constraints for optimal database performance

-- Create additional indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Create full-text search index for products
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, '')));

-- Create partial indexes for active products
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON public.products(created_at DESC) WHERE is_active = true AND is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active_category ON public.products(category, price) WHERE is_active = true;

-- Create composite indexes for order queries
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at DESC);

-- Create composite indexes for booking queries
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON public.bookings(appointment_date, status) WHERE status NOT IN ('cancelled', 'no_show');
CREATE INDEX IF NOT EXISTS idx_bookings_service_date ON public.bookings(service_type, appointment_date);

-- Create composite indexes for payment queries
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON public.payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_type_status ON public.payments(payment_type, status);

-- Add check constraints for data validation
ALTER TABLE public.products ADD CONSTRAINT check_products_price_positive CHECK (price > 0);
ALTER TABLE public.products ADD CONSTRAINT check_products_original_price CHECK (original_price IS NULL OR original_price >= price);
ALTER TABLE public.products ADD CONSTRAINT check_products_rating_range CHECK (rating >= 0 AND rating <= 5);

ALTER TABLE public.orders ADD CONSTRAINT check_orders_total_calculation CHECK (total_amount = subtotal + tax_amount + shipping_cost - discount_amount);
ALTER TABLE public.order_items ADD CONSTRAINT check_order_items_total_calculation CHECK (total_price = unit_price * quantity);

ALTER TABLE public.bookings ADD CONSTRAINT check_bookings_appointment_future CHECK (appointment_date >= CURRENT_DATE);
ALTER TABLE public.bookings ADD CONSTRAINT check_bookings_price_positive CHECK (price >= 0);

-- Create views for common queries
CREATE OR REPLACE VIEW public.active_products AS
SELECT *
FROM public.products
WHERE is_active = true
ORDER BY is_featured DESC, created_at DESC;

CREATE OR REPLACE VIEW public.featured_products AS
SELECT *
FROM public.products
WHERE is_active = true AND is_featured = true
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.low_stock_products AS
SELECT *
FROM public.products
WHERE is_active = true AND stock_quantity <= min_stock_level
ORDER BY stock_quantity ASC;

CREATE OR REPLACE VIEW public.order_summary AS
SELECT 
  o.id,
  o.order_number,
  o.user_id,
  u.full_name as customer_name,
  u.email as customer_email,
  o.status,
  o.payment_status,
  o.total_amount,
  o.created_at,
  COUNT(oi.id) as item_count
FROM public.orders o
JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.full_name, u.email;

CREATE OR REPLACE VIEW public.booking_summary AS
SELECT 
  b.id,
  b.booking_number,
  b.user_id,
  u.full_name as customer_name,
  u.email as customer_email,
  u.phone as customer_phone,
  b.service_type,
  b.service_name,
  b.pet_name,
  b.pet_type,
  b.appointment_date,
  b.appointment_time,
  b.status,
  b.payment_status,
  b.price,
  b.created_at
FROM public.bookings b
JOIN public.users u ON b.user_id = u.id;

-- Create function for product search
CREATE OR REPLACE FUNCTION public.search_products(search_term TEXT)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  image_url TEXT,
  rating DECIMAL(3,2),
  review_count INTEGER,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.category,
    p.price,
    p.original_price,
    p.image_url,
    p.rating,
    p.review_count,
    ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.brand, '')), plainto_tsquery('english', search_term)) as rank
  FROM public.products p
  WHERE p.is_active = true
    AND to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.brand, '')) @@ plainto_tsquery('english', search_term)
  ORDER BY rank DESC, p.is_featured DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get available appointment slots
CREATE OR REPLACE FUNCTION public.get_available_slots(service_date DATE, service_duration INTEGER DEFAULT 60)
RETURNS TABLE(time_slot TIME) AS $$
DECLARE
  start_time TIME := '09:00:00';
  end_time TIME := '17:00:00';
  slot_duration INTERVAL := (service_duration || ' minutes')::INTERVAL;
  current_slot TIME;
BEGIN
  current_slot := start_time;
  
  WHILE current_slot + slot_duration <= end_time LOOP
    -- Check if slot is available
    IF NOT EXISTS (
      SELECT 1 FROM public.bookings
      WHERE appointment_date = service_date
        AND appointment_time = current_slot
        AND status NOT IN ('cancelled', 'no_show')
    ) THEN
      time_slot := current_slot;
      RETURN NEXT;
    END IF;
    
    current_slot := current_slot + slot_duration;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions on views and functions
GRANT SELECT ON public.active_products TO anon, authenticated;
GRANT SELECT ON public.featured_products TO anon, authenticated;
GRANT SELECT ON public.low_stock_products TO authenticated;
GRANT SELECT ON public.order_summary TO authenticated;
GRANT SELECT ON public.booking_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_products(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_slots(DATE, INTEGER) TO anon, authenticated;