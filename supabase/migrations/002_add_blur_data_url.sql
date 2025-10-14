-- Migration: Add blur_data_url column to images table
-- Purpose: Store base64-encoded blur placeholders for progressive image loading
-- Task: 0002.28

-- Add blur_data_url column to images table
ALTER TABLE images
ADD COLUMN blur_data_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN images.blur_data_url IS 'Base64-encoded blur placeholder (20px JPEG) for progressive loading';

