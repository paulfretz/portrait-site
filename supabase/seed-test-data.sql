-- Seed data for test database
-- This script populates the test database with sample data for E2E testing
-- Run this against the TEST Supabase project only!

-- ============================================================================
-- IMPORTANT: This script should ONLY be run against the test database
-- URL: https://viqvpxipqmkswpflpqfx.supabase.co
-- ============================================================================

-- Clear existing data (in reverse order of dependencies)
DELETE FROM images;
DELETE FROM galleries;
DELETE FROM categories;
DELETE FROM inquiries;
DELETE FROM page_content;

-- Reset sequences
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE galleries_id_seq RESTART WITH 1;
ALTER SEQUENCE images_id_seq RESTART WITH 1;
ALTER SEQUENCE inquiries_id_seq RESTART WITH 1;
ALTER SEQUENCE page_content_id_seq RESTART WITH 1;

-- ============================================================================
-- CATEGORIES
-- ============================================================================
INSERT INTO categories (name, slug, description, display_order, is_visible) VALUES
  ('Weddings', 'weddings', 'Beautiful wedding photography capturing your special day', 1, true),
  ('Portraits', 'portraits', 'Professional portrait photography for individuals and families', 2, true),
  ('Events', 'events', 'Event photography for all occasions', 3, true),
  ('Seniors', 'seniors', 'Senior portrait photography', 4, true),
  ('Families', 'families', 'Family portrait sessions', 5, true),
  ('Maternity', 'maternity', 'Maternity and newborn photography', 6, true),
  ('Engagement', 'engagement', 'Engagement session photography', 7, true);

-- ============================================================================
-- GALLERIES
-- ============================================================================
INSERT INTO galleries (category_id, title, slug, description, location, event_date, is_published, display_order, created_at, updated_at) VALUES
  -- Weddings
  (1, 'Sarah & John Wedding', 'sarah-john-wedding', 'A beautiful summer wedding in Missoula', 'Missoula, MT', '2024-06-15', true, 1, NOW(), NOW()),
  (1, 'Emma & Michael Wedding', 'emma-michael-wedding', 'Elegant wedding at sunset', 'Bozeman, MT', '2024-07-20', true, 2, NOW(), NOW()),
  
  -- Portraits
  (2, 'Smith Family Portraits', 'smith-family-portraits', 'Annual family portrait session', 'Missoula, MT', '2024-08-10', true, 1, NOW(), NOW()),
  (2, 'Johnson Family Portraits', 'johnson-family-portraits', 'Outdoor family session', 'Kalispell, MT', '2024-09-05', true, 2, NOW(), NOW()),
  
  -- Events
  (3, 'Corporate Event 2024', 'corporate-event-2024', 'Annual company gathering', 'Billings, MT', '2024-05-12', true, 1, NOW(), NOW()),
  
  -- Seniors
  (4, 'Class of 2024 - Alex', 'class-2024-alex', 'Senior portraits for graduation', 'Missoula, MT', '2024-04-15', true, 1, NOW(), NOW()),
  
  -- Families
  (5, 'Anderson Family Fall Session', 'anderson-family-fall', 'Fall family portraits', 'Missoula, MT', '2024-10-01', true, 1, NOW(), NOW()),
  
  -- Maternity
  (6, 'Expecting Baby Thompson', 'expecting-baby-thompson', 'Maternity session', 'Missoula, MT', '2024-08-20', true, 1, NOW(), NOW()),
  
  -- Engagement
  (7, 'David & Lisa Engagement', 'david-lisa-engagement', 'Engagement session in the mountains', 'Glacier National Park, MT', '2024-09-15', true, 1, NOW(), NOW());

-- ============================================================================
-- IMAGES
-- ============================================================================
-- Note: Using placeholder URLs - these will be replaced with actual Vercel Blob URLs in production
-- For testing, we use high-quality Unsplash images

-- Sarah & John Wedding (Gallery ID: 1)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (1, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000', 'Bride and groom first dance', 2000, 1333, 1, true, 1, 'data:image/jpeg;base64,/9j/4AAQSkZJRg'),
  (1, 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2000', 'Wedding ceremony', 2000, 1333, 2, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg'),
  (1, 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=2000', 'Wedding reception', 2000, 1333, 3, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg'),
  (1, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=2000', 'Wedding details', 2000, 1333, 4, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- Emma & Michael Wedding (Gallery ID: 2)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (2, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=2000', 'Sunset wedding photo', 2000, 1333, 1, true, 2, 'data:image/jpeg;base64,/9j/4AAQSkZJRg'),
  (2, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=2000', 'Wedding couple portrait', 2000, 1333, 2, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg'),
  (2, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2000', 'Wedding party', 2000, 1333, 3, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- Smith Family Portraits (Gallery ID: 3)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (3, 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=2000', 'Smith family portrait', 2000, 1333, 1, true, 3, 'data:image/jpeg;base64,/9j/4AAQSkZJRg'),
  (3, 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=2000', 'Family outdoor session', 2000, 1333, 2, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- Johnson Family Portraits (Gallery ID: 4)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (4, 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=2000', 'Johnson family portrait', 2000, 1333, 1, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg'),
  (4, 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=2000', 'Family candid moment', 2000, 1333, 2, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- Corporate Event (Gallery ID: 5)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (5, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2000', 'Corporate event', 2000, 1333, 1, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- Senior Portrait (Gallery ID: 6)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (6, 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=2000', 'Senior portrait', 2000, 1333, 1, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- Anderson Family Fall (Gallery ID: 7)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (7, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=2000', 'Fall family session', 2000, 1333, 1, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- Maternity Session (Gallery ID: 8)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (8, 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=2000', 'Maternity portrait', 2000, 1333, 1, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- Engagement Session (Gallery ID: 9)
INSERT INTO images (gallery_id, url, alt_text, width, height, display_order, is_hero_image, hero_display_order, blur_data_url) VALUES
  (9, 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=2000', 'Engagement photo', 2000, 1333, 1, false, NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRg');

-- ============================================================================
-- PAGE CONTENT
-- ============================================================================
INSERT INTO page_content (page_name, section_name, content_type, content, display_order) VALUES
  ('about', 'hero', 'text', 'About DJ Coveno', 1),
  ('about', 'bio', 'html', '<p>Professional photographer based in Montana, specializing in portraits and weddings.</p>', 2),
  ('home', 'hero', 'text', 'DJ Coveno Portraits', 1),
  ('home', 'tagline', 'text', 'Capturing authentic moments and timeless memories', 2);

-- ============================================================================
-- SAMPLE INQUIRIES (for testing inquiry management)
-- ============================================================================
INSERT INTO inquiries (name, email, phone, message, event_type, event_date, budget_range, status, created_at) VALUES
  ('Test User 1', 'test1@example.com', '406-555-0101', 'Interested in wedding photography', 'wedding', '2025-06-15', '3000-5000', 'new', NOW() - INTERVAL '2 days'),
  ('Test User 2', 'test2@example.com', '406-555-0102', 'Need family portraits', 'portrait', NULL, '500-1000', 'new', NOW() - INTERVAL '1 day'),
  ('Test User 3', 'test3@example.com', '406-555-0103', 'Senior photos needed', 'senior', '2025-05-01', '500-1000', 'contacted', NOW() - INTERVAL '5 days'),
  ('Test User 4', 'test4@example.com', '406-555-0104', 'Engagement session inquiry', 'engagement', '2025-07-20', '1000-2000', 'new', NOW() - INTERVAL '3 days'),
  ('Test User 5', 'test5@example.com', '406-555-0105', 'Maternity photos', 'maternity', '2025-04-10', '500-1000', 'new', NOW());

-- ============================================================================
-- RLS POLICIES - Disable for testing OR configure properly
-- ============================================================================

-- Option 1: Disable RLS for testing (RECOMMENDED for test database)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE galleries DISABLE ROW LEVEL SECURITY;
ALTER TABLE images DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, add permissive policies
-- Uncomment these if you prefer to test WITH RLS enabled:

/*
-- Allow public read access to published content
CREATE POLICY "Public can view published categories" ON categories
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Public can view published galleries" ON galleries
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view images in published galleries" ON images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM galleries 
      WHERE galleries.id = images.gallery_id 
      AND galleries.is_published = true
    )
  );

-- Allow anyone to submit inquiries (for contact form testing)
CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view page content" ON page_content
  FOR SELECT USING (true);

-- Admin policies (authenticated users can do everything)
CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage galleries" ON galleries
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage images" ON images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view inquiries" ON inquiries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update inquiries" ON inquiries
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage page content" ON page_content
  FOR ALL USING (auth.role() = 'authenticated');
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the seed data was inserted correctly:

-- SELECT COUNT(*) as category_count FROM categories;
-- SELECT COUNT(*) as gallery_count FROM galleries;
-- SELECT COUNT(*) as image_count FROM images;
-- SELECT COUNT(*) as inquiry_count FROM inquiries;
-- SELECT COUNT(*) as page_content_count FROM page_content;

-- Expected results:
-- category_count: 7
-- gallery_count: 9
-- image_count: 13
-- inquiry_count: 5
-- page_content_count: 4

COMMIT;

