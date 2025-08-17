-- Insert sample product data for PawRanger e-commerce catalog

-- Insert sample products for different categories
INSERT INTO public.products (
  name, description, category, price, original_price, brand, sku, 
  stock_quantity, min_stock_level, image_url, image_urls, 
  rating, review_count, is_active, is_featured, tags, dimensions
) VALUES
-- Dog Food Category
('Premium Adult Dog Food - Chicken & Rice', 'High-quality dry dog food made with real chicken and brown rice. Perfect for adult dogs of all sizes. Contains essential vitamins and minerals for optimal health.', 'food', 45.99, 52.99, 'PawNutrition', 'PN-DOG-001', 50, 10, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20dog%20food%20bag%20chicken%20rice%20professional%20product%20photo&image_size=square', ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20food%20kibble%20close%20up%20texture&image_size=square'], 4.5, 127, true, true, ARRAY['chicken', 'rice', 'adult', 'dry food'], '{"length": 30, "width": 20, "height": 10}'),

('Grain-Free Puppy Food - Salmon', 'Specially formulated grain-free puppy food with real salmon as the first ingredient. Supports healthy growth and development.', 'food', 38.99, null, 'PawNutrition', 'PN-PUP-002', 35, 8, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=puppy%20food%20bag%20salmon%20grain%20free%20professional%20product%20photo&image_size=square', ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=salmon%20puppy%20kibble%20small%20size&image_size=square'], 4.7, 89, true, true, ARRAY['salmon', 'grain-free', 'puppy', 'growth'], '{"length": 25, "width": 18, "height": 8}'),

-- Toys Category
('Interactive Puzzle Toy - Level 2', 'Mental stimulation puzzle toy that challenges your dog while dispensing treats. Great for reducing boredom and anxiety.', 'toys', 24.99, 29.99, 'BrainPaws', 'BP-TOY-003', 25, 5, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20puzzle%20toy%20interactive%20treat%20dispenser%20colorful&image_size=square', ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20playing%20with%20puzzle%20toy&image_size=square'], 4.3, 156, true, false, ARRAY['puzzle', 'interactive', 'mental stimulation', 'treats'], '{"length": 15, "width": 15, "height": 8}'),

('Rope Tug Toy - Extra Strong', 'Durable cotton rope toy perfect for tug-of-war and solo play. Helps clean teeth and massage gums naturally.', 'toys', 12.99, null, 'PlayTime', 'PT-ROPE-004', 40, 10, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cotton%20rope%20dog%20toy%20colorful%20braided%20strong&image_size=square', null, 4.1, 203, true, false, ARRAY['rope', 'tug', 'dental', 'cotton'], '{"length": 35, "width": 3, "height": 3}'),

('Squeaky Plush Duck', 'Soft and cuddly plush toy with built-in squeaker. Perfect for gentle play and comfort.', 'toys', 8.99, 11.99, 'CuddlePaws', 'CP-DUCK-005', 60, 15, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=plush%20duck%20dog%20toy%20yellow%20squeaky%20cute&image_size=square', null, 4.0, 78, true, false, ARRAY['plush', 'squeaky', 'soft', 'comfort'], '{"length": 12, "width": 8, "height": 6}'),

-- Accessories Category
('Adjustable Collar - Reflective', 'High-quality nylon collar with reflective stitching for nighttime visibility. Adjustable and comfortable for daily wear.', 'accessories', 16.99, null, 'SafePaws', 'SP-COL-006', 30, 8, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20collar%20reflective%20nylon%20adjustable%20blue&image_size=square', ARRAY['https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20wearing%20reflective%20collar%20night&image_size=square'], 4.4, 92, true, false, ARRAY['collar', 'reflective', 'adjustable', 'safety'], '{"length": 40, "width": 2.5, "height": 1}'),

('Retractable Leash - 16ft', 'Durable retractable leash with comfortable grip handle and reliable locking mechanism. Perfect for walks and training.', 'accessories', 22.99, 27.99, 'WalkEasy', 'WE-LEASH-007', 20, 5, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=retractable%20dog%20leash%20black%20handle%20professional&image_size=square', null, 4.2, 134, true, true, ARRAY['leash', 'retractable', 'walking', 'training'], '{"length": 15, "width": 12, "height": 4}'),

('Stainless Steel Food Bowl Set', 'Set of two stainless steel bowls with non-slip rubber base. Dishwasher safe and rust-resistant.', 'accessories', 19.99, null, 'FeedWell', 'FW-BOWL-008', 45, 10, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=stainless%20steel%20dog%20bowls%20set%20non%20slip%20base&image_size=square', null, 4.6, 167, true, false, ARRAY['bowls', 'stainless steel', 'non-slip', 'set'], '{"length": 20, "width": 20, "height": 8}'),

-- Health Category
('Multivitamin Chews - Senior Dogs', 'Specially formulated multivitamin chews for senior dogs. Supports joint health, immune system, and overall vitality.', 'health', 24.99, null, 'VitaPet', 'VP-MULTI-009', 25, 12, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20vitamin%20chews%20bottle%20senior%20health&image_size=square', null, 4.5, 89, true, false, ARRAY['vitamins', 'senior', 'health', 'chews'], '{"length": 12, "width": 8, "height": 15}'),

('Dental Care Sticks - Large Dogs', 'Natural dental care sticks that help reduce tartar and freshen breath. Made with real chicken and parsley.', 'health', 18.99, null, 'DentalFresh', 'DF-STICK-010', 35, 15, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20dental%20sticks%20natural%20chicken%20large&image_size=square', null, 4.3, 156, true, false, ARRAY['dental', 'sticks', 'natural', 'chicken'], '{"length": 15, "width": 2, "height": 2}'),

-- Cat Products
('Premium Cat Litter - Clumping', 'Ultra-absorbent clumping cat litter with odor control technology. Dust-free and easy to clean.', 'accessories', 12.99, null, 'CleanPaws', 'CP-LITTER-011', 40, 20, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20litter%20bag%20clumping%20premium%20clean&image_size=square', null, 4.4, 203, true, false, ARRAY['cat', 'litter', 'clumping', 'odor-control'], '{"length": 35, "width": 25, "height": 15}'),

('Interactive Cat Wand Toy', 'Feather wand toy that encourages natural hunting instincts. Retractable design for easy storage.', 'toys', 9.99, 12.99, 'FelinePlay', 'FP-WAND-012', 35, 8, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20feather%20wand%20toy%20interactive%20colorful&image_size=square', null, 4.2, 73, true, false, ARRAY['cat', 'wand', 'feather', 'interactive'], '{"length": 90, "width": 3, "height": 3}'),

('Cat Scratching Post - Sisal', 'Tall sisal scratching post with stable base. Helps maintain healthy claws and protects furniture.', 'accessories', 34.99, 39.99, 'ScratchSafe', 'SS-POST-013', 15, 3, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20scratching%20post%20sisal%20tall%20stable&image_size=square', null, 4.6, 94, true, true, ARRAY['scratching post', 'sisal', 'furniture protection', 'claws'], '{"length": 40, "width": 40, "height": 80}'),

-- Grooming Category
('Professional Dog Brush - Slicker', 'High-quality slicker brush for removing loose fur and preventing matting. Comfortable ergonomic handle.', 'grooming', 13.99, null, 'GroomPro', 'GP-BRUSH-014', 50, 18, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20slicker%20brush%20professional%20grooming%20tool&image_size=square', null, 4.5, 127, true, false, ARRAY['brush', 'slicker', 'grooming', 'professional'], '{"length": 20, "width": 8, "height": 3}'),

('Nail Clippers - Safety Guard', 'Professional-grade nail clippers with safety guard to prevent over-cutting. Sharp stainless steel blades.', 'grooming', 11.99, 14.99, 'TrimSafe', 'TS-CLIP-015', 25, 5, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20nail%20clippers%20safety%20guard%20professional&image_size=square', null, 4.1, 65, true, false, ARRAY['nail clippers', 'safety', 'grooming', 'stainless steel'], '{"length": 15, "width": 8, "height": 2}')

ON CONFLICT (sku) DO NOTHING;

-- Update product counts and featured status
UPDATE public.products SET review_count = review_count + FLOOR(RANDOM() * 50) WHERE review_count < 100;
UPDATE public.products SET is_featured = true WHERE category IN ('food', 'accessories') AND price > 20;

-- Insert some product variants (different sizes/colors)
INSERT INTO public.products (
  name, description, category, price, original_price, brand, sku, 
  stock_quantity, min_stock_level, image_url, rating, review_count, 
  is_active, is_featured, tags, dimensions
) VALUES
('Adjustable Collar - Reflective (Small)', 'High-quality nylon collar with reflective stitching for nighttime visibility. Small size for puppies and small dogs.', 'accessories', 14.99, null, 'SafePaws', 'SP-COL-006-S', 20, 5, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=small%20dog%20collar%20reflective%20nylon%20red&image_size=square', 4.4, 45, true, false, ARRAY['collar', 'reflective', 'small', 'puppy'], '{"size": "Small (8-12 inches)", "material": "Nylon", "width": "0.75 inch"}'),

('Adjustable Collar - Reflective (Large)', 'High-quality nylon collar with reflective stitching for nighttime visibility. Large size for big dogs.', 'accessories', 18.99, null, 'SafePaws', 'SP-COL-006-L', 15, 3, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=large%20dog%20collar%20reflective%20nylon%20black&image_size=square', 4.4, 67, true, false, ARRAY['collar', 'reflective', 'large', 'big dogs'], '{"size": "Large (18-26 inches)", "material": "Nylon", "width": "1.5 inch"}'),

('Premium Adult Dog Food - Lamb & Sweet Potato', 'High-quality dry dog food made with real lamb and sweet potato. Grain-free formula for sensitive stomachs.', 'food', 48.99, 55.99, 'PawNutrition', 'PN-DOG-001-L', 30, 8, 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20dog%20food%20bag%20lamb%20sweet%20potato%20grain%20free&image_size=square', 4.6, 98, true, true, ARRAY['lamb', 'sweet potato', 'grain-free', 'sensitive'], '{"weight": "15 lbs", "protein": "24%", "fat": "14%", "fiber": "3.5%"}')

ON CONFLICT (sku) DO NOTHING;

-- Create some sample categories for better organization
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.product_categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert category data
INSERT INTO public.product_categories (name, description, slug, image_url, sort_order) VALUES
('Dog Food', 'Premium nutrition for dogs of all ages and sizes', 'dog-food', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dog%20food%20category%20banner%20healthy%20nutrition&image_size=landscape_16_9', 1),
('Cat Food', 'Complete nutrition for cats and kittens', 'cat-food', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20food%20category%20banner%20feline%20nutrition&image_size=landscape_16_9', 2),
('Toys & Entertainment', 'Fun and engaging toys for pets', 'toys', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20toys%20category%20banner%20colorful%20playful&image_size=landscape_16_9', 3),
('Accessories', 'Essential accessories for pet care', 'accessories', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20accessories%20category%20banner%20collars%20leashes&image_size=landscape_16_9', 4),
('Health & Wellness', 'Supplements and health products', 'health', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20health%20category%20banner%20vitamins%20wellness&image_size=landscape_16_9', 5),
('Grooming', 'Professional grooming tools and supplies', 'grooming', 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=pet%20grooming%20category%20banner%20brushes%20tools&image_size=landscape_16_9', 6)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS on categories table
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Anyone can view active categories" ON public.product_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.product_categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Grant permissions
GRANT SELECT ON public.product_categories TO anon, authenticated;
GRANT ALL ON public.product_categories TO authenticated;

-- Add updated_at trigger for categories
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();