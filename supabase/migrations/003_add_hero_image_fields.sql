-- Migration: Add hero image fields to images table
-- Purpose: Enable marking images as hero slideshow images with custom ordering
-- Task: 0002.34-0002.35

-- Add is_hero_image boolean column
ALTER TABLE images
ADD COLUMN is_hero_image BOOLEAN NOT NULL DEFAULT FALSE;

-- Add hero_display_order integer column for slideshow ordering
ALTER TABLE images
ADD COLUMN hero_display_order INTEGER;

-- Create index for efficient hero image queries
CREATE INDEX idx_images_hero ON images(is_hero_image, hero_display_order) WHERE is_hero_image = TRUE;

-- Add comments for documentation
COMMENT ON COLUMN images.is_hero_image IS 'Marks image as part of homepage hero slideshow';
COMMENT ON COLUMN images.hero_display_order IS 'Display order in hero slideshow (NULL for non-hero images)';

