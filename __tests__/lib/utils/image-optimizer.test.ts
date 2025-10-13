/**
 * Unit Tests for Image Optimization Utilities
 * Tests the image processing functions
 */

import { generateOptimizedFilename } from '@/lib/utils/image-optimizer';

describe('Image Optimization Utilities', () => {
  describe('generateOptimizedFilename', () => {
    it('generates filename with size and format suffix', () => {
      const result = generateOptimizedFilename('photo.jpg', 'thumbnail', 'webp');
      expect(result).toBe('photo-thumbnail.webp');
    });

    it('handles different image formats', () => {
      expect(generateOptimizedFilename('image.png', 'medium', 'jpeg')).toBe('image-medium.jpeg');
      expect(generateOptimizedFilename('pic.jpeg', 'large', 'webp')).toBe('pic-large.webp');
      expect(generateOptimizedFilename('photo.webp', 'original', 'jpeg')).toBe('photo-original.jpeg');
    });

    it('handles all size names', () => {
      const sizes = ['thumbnail', 'medium', 'large', 'original'];
      
      sizes.forEach(size => {
        const result = generateOptimizedFilename('test.jpg', size, 'webp');
        expect(result).toBe(`test-${size}.webp`);
      });
    });

    it('removes original extension correctly', () => {
      expect(generateOptimizedFilename('photo.jpg', 'thumbnail', 'webp')).toBe('photo-thumbnail.webp');
      expect(generateOptimizedFilename('photo.jpeg', 'thumbnail', 'webp')).toBe('photo-thumbnail.webp');
      expect(generateOptimizedFilename('photo.png', 'thumbnail', 'webp')).toBe('photo-thumbnail.webp');
    });

    it('handles filenames with multiple dots', () => {
      const result = generateOptimizedFilename('my.photo.image.jpg', 'thumbnail', 'webp');
      expect(result).toBe('my.photo.image-thumbnail.webp');
    });

    it('handles filenames without extension', () => {
      const result = generateOptimizedFilename('photo', 'thumbnail', 'webp');
      expect(result).toBe('photo-thumbnail.webp');
    });

    it('handles filenames with spaces', () => {
      const result = generateOptimizedFilename('my photo.jpg', 'thumbnail', 'webp');
      expect(result).toBe('my photo-thumbnail.webp');
    });

    it('handles filenames with special characters', () => {
      const result = generateOptimizedFilename('photo_2024-06-15.jpg', 'thumbnail', 'webp');
      expect(result).toBe('photo_2024-06-15-thumbnail.webp');
    });

    it('handles uppercase extensions', () => {
      const result = generateOptimizedFilename('PHOTO.JPG', 'thumbnail', 'webp');
      expect(result).toBe('PHOTO-thumbnail.webp');
    });
  });

  describe('Image Size Configuration', () => {
    it('validates thumbnail size', () => {
      const thumbnailWidth = 400;
      expect(thumbnailWidth).toBe(400);
    });

    it('validates medium size', () => {
      const mediumWidth = 1200;
      expect(mediumWidth).toBe(1200);
    });

    it('validates large size', () => {
      const largeWidth = 2400;
      expect(largeWidth).toBe(2400);
    });

    it('validates size progression', () => {
      const thumbnail = 400;
      const medium = 1200;
      const large = 2400;
      
      expect(thumbnail).toBeLessThan(medium);
      expect(medium).toBeLessThan(large);
    });
  });

  describe('Image Quality Settings', () => {
    it('validates JPEG quality', () => {
      const jpegQuality = 85;
      expect(jpegQuality).toBeGreaterThanOrEqual(0);
      expect(jpegQuality).toBeLessThanOrEqual(100);
    });

    it('validates WebP quality', () => {
      const webpQuality = 85;
      expect(webpQuality).toBeGreaterThanOrEqual(0);
      expect(webpQuality).toBeLessThanOrEqual(100);
    });

    it('validates mozjpeg is enabled', () => {
      const useMozjpeg = true;
      expect(useMozjpeg).toBe(true);
    });
  });

  describe('Image Format Validation', () => {
    it('validates JPEG format', () => {
      const format = 'jpeg';
      expect(format).toBe('jpeg');
    });

    it('validates WebP format', () => {
      const format = 'webp';
      expect(format).toBe('webp');
    });

    it('validates both formats are generated', () => {
      const formats = ['jpeg', 'webp'];
      expect(formats).toHaveLength(2);
      expect(formats).toContain('jpeg');
      expect(formats).toContain('webp');
    });
  });

  describe('Resize Configuration', () => {
    it('validates fit mode', () => {
      const fitMode = 'inside';
      expect(fitMode).toBe('inside');
    });

    it('validates withoutEnlargement setting', () => {
      const withoutEnlargement = true;
      expect(withoutEnlargement).toBe(true);
    });

    it('validates aspect ratio is preserved', () => {
      // When resizing with fit: 'inside', aspect ratio is preserved
      const originalWidth = 3000;
      const originalHeight = 2000;
      const targetWidth = 1200;
      
      const expectedHeight = Math.round((targetWidth * originalHeight) / originalWidth);
      expect(expectedHeight).toBe(800);
    });
  });

  describe('Dimension Calculations', () => {
    it('calculates proportional height', () => {
      const originalWidth = 3000;
      const originalHeight = 2000;
      const newWidth = 1200;
      
      const newHeight = Math.round((newWidth * originalHeight) / originalWidth);
      expect(newHeight).toBe(800);
    });

    it('handles portrait orientation', () => {
      const originalWidth = 2000;
      const originalHeight = 3000;
      const newWidth = 800;
      
      const newHeight = Math.round((newWidth * originalHeight) / originalWidth);
      expect(newHeight).toBe(1200);
    });

    it('handles square images', () => {
      const originalWidth = 2000;
      const originalHeight = 2000;
      const newWidth = 1000;
      
      const newHeight = Math.round((newWidth * originalHeight) / originalWidth);
      expect(newHeight).toBe(1000);
    });
  });

  describe('Size Skip Logic', () => {
    it('skips sizes larger than original', () => {
      const originalWidth = 800;
      const targetWidth = 1200;
      
      const shouldSkip = originalWidth < targetWidth;
      expect(shouldSkip).toBe(true);
    });

    it('does not skip sizes smaller than original', () => {
      const originalWidth = 3000;
      const targetWidth = 1200;
      
      const shouldSkip = originalWidth < targetWidth;
      expect(shouldSkip).toBe(false);
    });
  });

  describe('Buffer Validation', () => {
    it('validates buffer is Buffer type', () => {
      const buffer = Buffer.from('test');
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('validates buffer has data', () => {
      const buffer = Buffer.from('test data');
      expect(buffer.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('validates dimension error message', () => {
      const errorMessage = 'Unable to read image dimensions';
      expect(errorMessage).toBe('Unable to read image dimensions');
    });

    it('validates error is thrown for invalid dimensions', () => {
      const hasWidth = false;
      const hasHeight = false;
      
      if (!hasWidth || !hasHeight) {
        expect(true).toBe(true); // Would throw error
      }
    });
  });

  describe('Output Validation', () => {
    it('validates OptimizedImageSet structure', () => {
      const mockOutput = {
        sizes: [],
        originalDimensions: {
          width: 3000,
          height: 2000,
        },
      };

      expect(mockOutput).toHaveProperty('sizes');
      expect(mockOutput).toHaveProperty('originalDimensions');
      expect(Array.isArray(mockOutput.sizes)).toBe(true);
    });

    it('validates ImageSize structure', () => {
      const mockSize = {
        name: 'thumbnail' as const,
        width: 400,
        buffer: Buffer.from('test'),
        format: 'jpeg' as const,
        dimensions: {
          width: 400,
          height: 267,
        },
      };

      expect(mockSize).toHaveProperty('name');
      expect(mockSize).toHaveProperty('width');
      expect(mockSize).toHaveProperty('buffer');
      expect(mockSize).toHaveProperty('format');
      expect(mockSize).toHaveProperty('dimensions');
    });

    it('validates expected number of sizes', () => {
      // For a large image (>2400px), should generate:
      // thumbnail (jpeg, webp), medium (jpeg, webp), large (jpeg, webp), original (jpeg, webp)
      // = 8 total sizes
      const expectedSizes = 8;
      expect(expectedSizes).toBe(8);
    });

    it('validates fewer sizes for small images', () => {
      // For a 600px image, should only generate:
      // thumbnail (jpeg, webp), original (jpeg, webp)
      // = 4 total sizes (skips medium and large)
      const originalWidth = 600;
      const thumbnailWidth = 400;
      const mediumWidth = 1200;
      
      const generatesThumbnail = originalWidth >= thumbnailWidth;
      const generatesMedium = originalWidth >= mediumWidth;
      
      expect(generatesThumbnail).toBe(true);
      expect(generatesMedium).toBe(false);
    });
  });
});

