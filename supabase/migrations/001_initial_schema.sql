-- ============================================================================
-- DJ Coveno Portraits - Initial Database Schema
-- ============================================================================
-- Version: 1.0
-- Created: October 9, 2025
-- Description: Creates all tables, indexes, RLS policies, and seed data
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 Categories Table
-- ----------------------------------------------------------------------------
-- Photography categories for organizing galleries
-- (Weddings, Engagements, Portraits, Pets, Families, Seniors, Proposals)
-- ----------------------------------------------------------------------------

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE categories IS 'Photography categories for organizing galleries';

-- ----------------------------------------------------------------------------
-- 2.2 Galleries Table
-- ----------------------------------------------------------------------------
-- Individual gallery entries with metadata
-- ----------------------------------------------------------------------------

CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  client_name TEXT NOT NULL, -- PRIVATE - not displayed publicly
  cover_image_id UUID, -- Set after images are uploaded
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Add comment for documentation
COMMENT ON TABLE galleries IS 'Individual gallery entries with metadata';
COMMENT ON COLUMN galleries.client_name IS 'PRIVATE - Client name for admin records, not displayed publicly';
COMMENT ON COLUMN galleries.cover_image_id IS 'Foreign key to images table, set after images are uploaded';

-- ----------------------------------------------------------------------------
-- 2.3 Images Table
-- ----------------------------------------------------------------------------
-- Photos within galleries
-- ----------------------------------------------------------------------------

CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE images IS 'Photos within galleries';
COMMENT ON COLUMN images.url IS 'Full URL to image in storage (Vercel Blob or Cloudflare R2)';

-- ----------------------------------------------------------------------------
-- 2.4 Add Foreign Key for Gallery Cover Image
-- ----------------------------------------------------------------------------
-- Add foreign key constraint for galleries.cover_image_id
-- Must be done after images table is created
-- ----------------------------------------------------------------------------

ALTER TABLE galleries
  ADD CONSTRAINT fk_galleries_cover_image
  FOREIGN KEY (cover_image_id)
  REFERENCES images(id)
  ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 2.5 Inquiries Table
-- ----------------------------------------------------------------------------
-- Contact form submissions from potential clients
-- ----------------------------------------------------------------------------

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT inquiries_status_check CHECK (status IN ('new', 'contacted', 'booked', 'archived'))
);

-- Add comment for documentation
COMMENT ON TABLE inquiries IS 'Contact form submissions from potential clients';
COMMENT ON COLUMN inquiries.status IS 'Values: new, contacted, booked, archived';

-- ----------------------------------------------------------------------------
-- 2.6 Page Content Table
-- ----------------------------------------------------------------------------
-- Editable page content for inline editing (About, Contact, Homepage)
-- ----------------------------------------------------------------------------

CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page, section),
  CONSTRAINT page_content_type_check CHECK (content_type IN ('text', 'html', 'markdown', 'json'))
);

-- Add comment for documentation
COMMENT ON TABLE page_content IS 'Editable page content for inline editing';
COMMENT ON COLUMN page_content.page IS 'Page identifier: home, about, contact';
COMMENT ON COLUMN page_content.section IS 'Section identifier: hero_headline, bio, hours, etc.';
COMMENT ON COLUMN page_content.content_type IS 'Values: text, html, markdown, json';

-- ============================================================================
-- 3. CREATE INDEXES
-- ============================================================================

-- Categories indexes
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Galleries indexes
CREATE INDEX idx_galleries_category_id ON galleries(category_id);
CREATE INDEX idx_galleries_display_order ON galleries(display_order);
CREATE INDEX idx_galleries_date ON galleries(date DESC);
CREATE INDEX idx_galleries_cover_image_id ON galleries(cover_image_id);

-- Images indexes
CREATE INDEX idx_images_gallery_id ON images(gallery_id);
CREATE INDEX idx_images_display_order ON images(display_order);

-- Inquiries indexes
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_email ON inquiries(email);

-- Page content already has unique index on (page, section) which provides lookup performance

-- ============================================================================
-- 4. CREATE FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 Update Updated_At Timestamp Function
-- ----------------------------------------------------------------------------
-- Automatically updates the updated_at column when a row is modified
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. CREATE TRIGGERS
-- ============================================================================

-- Add triggers to automatically update updated_at column on all tables

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at
  BEFORE UPDATE ON galleries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_updated_at
  BEFORE UPDATE ON images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 6.1 Enable RLS on All Tables
-- ----------------------------------------------------------------------------

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 6.2 Categories Policies
-- ----------------------------------------------------------------------------

-- Public read access
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

-- Admin write access (authenticated users)
CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 6.3 Galleries Policies
-- ----------------------------------------------------------------------------

-- Public read access
CREATE POLICY "Galleries are publicly readable"
  ON galleries FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Authenticated users can insert galleries"
  ON galleries FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update galleries"
  ON galleries FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete galleries"
  ON galleries FOR DELETE
  USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 6.4 Images Policies
-- ----------------------------------------------------------------------------

-- Public read access
CREATE POLICY "Images are publicly readable"
  ON images FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Authenticated users can insert images"
  ON images FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images"
  ON images FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
  ON images FOR DELETE
  USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 6.5 Inquiries Policies
-- ----------------------------------------------------------------------------

-- NO public read access - inquiries are private
-- Public can only insert (submit inquiries)
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admin) can read and manage
CREATE POLICY "Authenticated users can read inquiries"
  ON inquiries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update inquiries"
  ON inquiries FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete inquiries"
  ON inquiries FOR DELETE
  USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 6.6 Page Content Policies
-- ----------------------------------------------------------------------------

-- Public read access
CREATE POLICY "Page content is publicly readable"
  ON page_content FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Authenticated users can insert page content"
  ON page_content FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update page content"
  ON page_content FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete page content"
  ON page_content FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 7. SEED DATA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 7.1 Seed Categories
-- ----------------------------------------------------------------------------
-- Insert default photography categories
-- ----------------------------------------------------------------------------

INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Weddings', 'weddings', 'Wedding photography in Montana - Big Sky, Bozeman, and Yellowstone areas', 1),
  ('Engagements', 'engagements', 'Engagement photo sessions capturing your love story', 2),
  ('Portraits', 'portraits', 'Individual and couples portrait photography', 3),
  ('Families', 'families', 'Family portrait sessions for all ages', 4),
  ('Seniors', 'seniors', 'Senior portrait photography for high school graduates', 5),
  ('Pets', 'pets', 'Pet photography celebrating your furry family members', 6),
  ('Proposals', 'proposals', 'Proposal photography capturing your special moment', 7);

-- ----------------------------------------------------------------------------
-- 7.2 Seed Page Content - Homepage
-- ----------------------------------------------------------------------------

INSERT INTO page_content (page, section, content, content_type) VALUES
  ('home', 'hero_headline', 'Montana Portrait Photography', 'text'),
  ('home', 'hero_subheadline', 'Capturing life''s moments in Big Sky, Bozeman, and Yellowstone', 'text'),
  ('home', 'hero_cta', 'View Galleries', 'text');

-- ----------------------------------------------------------------------------
-- 7.3 Seed Page Content - About Page
-- ----------------------------------------------------------------------------

INSERT INTO page_content (page, section, content, content_type) VALUES
  ('about', 'bio', '<p>Welcome! I''m DJ Coveno, a portrait photographer based in Montana. I specialize in capturing authentic moments that tell your unique story.</p>', 'html'),
  ('about', 'experience', '<p>With over 10 years of experience photographing weddings, engagements, families, and portraits across Montana, I bring a blend of technical expertise and artistic vision to every session.</p>', 'html'),
  ('about', 'philosophy', '<p>I believe photography should be natural and fun. My approach is relaxed and candid, focusing on genuine emotions and connections rather than stiff, posed shots.</p>', 'html'),
  ('about', 'social_instagram', 'https://instagram.com/', 'text'),
  ('about', 'social_facebook', 'https://facebook.com/', 'text');

-- ----------------------------------------------------------------------------
-- 7.4 Seed Page Content - Contact Page
-- ----------------------------------------------------------------------------

INSERT INTO page_content (page, section, content, content_type) VALUES
  ('contact', 'hours', 'Available 7 days a week by appointment', 'text'),
  ('contact', 'service_area', 'Serving Big Sky, Bozeman, Yellowstone, and surrounding Montana areas', 'text'),
  ('contact', 'intro', 'Let''s create something beautiful together! Fill out the form below and I''ll get back to you within 24 hours.', 'text');

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary:
-- ✓ Created 5 tables: categories, galleries, images, inquiries, page_content
-- ✓ Added all foreign key relationships
-- ✓ Created performance indexes
-- ✓ Set up automatic updated_at triggers
-- ✓ Enabled Row-Level Security (RLS) on all tables
-- ✓ Created RLS policies (public read + admin write)
-- ✓ Seeded 7 default categories
-- ✓ Seeded default page content for home, about, and contact pages

