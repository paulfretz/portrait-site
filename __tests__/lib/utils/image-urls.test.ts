/**
 * Unit Tests for Image URL Utilities
 * Tests srcset/sizes construction and variant URL generation
 */

import {
  getImageVariantUrl,
  generateSrcSet,
  generateLightboxSrcSet,
  getCoverImageUrl,
  getLightboxImageUrl,
  getThumbnailUrl,
} from '@/lib/utils/image-urls';

describe('Image URL Utilities', () => {
  const mockOriginalUrl = 'https://example.com/galleries/gallery1/1234567890-photo-original.jpeg';

  describe('getImageVariantUrl', () => {
    it('generates variant URL with correct size and format', () => {
      const result = getImageVariantUrl(mockOriginalUrl, 'large', 'webp');
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-large.webp');
    });

    it('handles different variants correctly', () => {
      expect(getImageVariantUrl(mockOriginalUrl, 'thumbnail', 'webp')).toContain('thumbnail.webp');
      expect(getImageVariantUrl(mockOriginalUrl, 'medium', 'webp')).toContain('medium.webp');
      expect(getImageVariantUrl(mockOriginalUrl, 'xlarge', 'webp')).toContain('xlarge.webp');
    });

    it('handles different formats correctly', () => {
      expect(getImageVariantUrl(mockOriginalUrl, 'large', 'jpeg')).toContain('.jpeg');
      expect(getImageVariantUrl(mockOriginalUrl, 'large', 'webp')).toContain('.webp');
      expect(getImageVariantUrl(mockOriginalUrl, 'large', 'avif')).toContain('.avif');
    });

    it('returns original URL if input is empty', () => {
      expect(getImageVariantUrl('', 'large', 'webp')).toBe('');
      expect(getImageVariantUrl(null as any, 'large', 'webp')).toBe(null);
    });
  });

  describe('generateSrcSet', () => {
    it('generates srcset with all variants in correct order', () => {
      const srcset = generateSrcSet(mockOriginalUrl);
      
      // Should contain all variants with width descriptors
      expect(srcset).toContain('400w');
      expect(srcset).toContain('1200w');
      expect(srcset).toContain('2400w');
      expect(srcset).toContain('4000w');
    });

    it('includes WebP and JPEG formats by default', () => {
      const srcset = generateSrcSet(mockOriginalUrl);
      
      // Check format order: WebP first, then JPEG
      const parts = srcset.split(', ');
      
      // First 4 should be WebP variants
      expect(parts[0]).toContain('.webp');
      expect(parts[1]).toContain('.webp');
      expect(parts[2]).toContain('.webp');
      expect(parts[3]).toContain('.webp');
      
      // Next 4 should be JPEG variants
      expect(parts[4]).toContain('.jpeg');
      expect(parts[5]).toContain('.jpeg');
      expect(parts[6]).toContain('.jpeg');
      expect(parts[7]).toContain('.jpeg');
    });

    it('includes AVIF format when includeAvif is true', () => {
      const srcset = generateSrcSet(mockOriginalUrl, true);
      const parts = srcset.split(', ');
      
      // Should have AVIF, WebP, then JPEG (12 total variants)
      expect(parts.length).toBe(12);
      expect(parts[0]).toContain('.avif');
      expect(parts[4]).toContain('.webp');
      expect(parts[8]).toContain('.jpeg');
    });

    it('orders variants by width (smallest to largest)', () => {
      const srcset = generateSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Extract widths from descriptors
      const widths = parts.map(part => {
        const match = part.match(/(\d+)w$/);
        return match ? parseInt(match[1], 10) : 0;
      });
      
      // First 4 (WebP) should be in ascending order: 400, 1200, 2400, 4000
      expect(widths[0]).toBe(400);
      expect(widths[1]).toBe(1200);
      expect(widths[2]).toBe(2400);
      expect(widths[3]).toBe(4000);
      
      // JPEG variants should also be in ascending order
      expect(widths[4]).toBe(400);
      expect(widths[5]).toBe(1200);
      expect(widths[6]).toBe(2400);
      expect(widths[7]).toBe(4000);
    });

    it('returns empty string for empty input', () => {
      expect(generateSrcSet('')).toBe('');
      expect(generateSrcSet(null as any)).toBe('');
    });

    it('generates correct URL format for each variant', () => {
      const srcset = generateSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Check first part (thumbnail WebP)
      expect(parts[0]).toBe('https://example.com/galleries/gallery1/1234567890-photo-thumbnail.webp 400w');
      
      // Check last part (xlarge JPEG)
      expect(parts[parts.length - 1]).toBe('https://example.com/galleries/gallery1/1234567890-photo-xlarge.jpeg 4000w');
    });

    it('maintains format priority: AVIF → WebP → JPEG when AVIF enabled', () => {
      const srcset = generateSrcSet(mockOriginalUrl, true);
      const parts = srcset.split(', ');
      
      // First 4 should be AVIF
      expect(parts.slice(0, 4).every(p => p.includes('.avif'))).toBe(true);
      // Next 4 should be WebP
      expect(parts.slice(4, 8).every(p => p.includes('.webp'))).toBe(true);
      // Last 4 should be JPEG
      expect(parts.slice(8, 12).every(p => p.includes('.jpeg'))).toBe(true);
    });
  });

  describe('generateLightboxSrcSet', () => {
    it('generates srcset with lightbox-specific variants', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      
      // Should contain large, xlarge, and original (all at 2400w or 4000w)
      expect(srcset).toContain('large');
      expect(srcset).toContain('xlarge');
      expect(srcset).toContain('original');
    });

    it('uses correct width descriptors for lightbox variants', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // All variants should use high-DPI widths
      parts.forEach(part => {
        const width = parseInt(part.match(/(\d+)w$/)![1], 10);
        expect([2400, 4000]).toContain(width);
      });
    });

    it('includes WebP and JPEG formats by default', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Should have 6 parts: 3 variants × 2 formats
      expect(parts.length).toBe(6);
      
      // First 3 should be WebP
      expect(parts.slice(0, 3).every(p => p.includes('.webp'))).toBe(true);
      // Last 3 should be JPEG
      expect(parts.slice(3, 6).every(p => p.includes('.jpeg'))).toBe(true);
    });

    it('includes AVIF format when includeAvif is true', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl, true);
      const parts = srcset.split(', ');
      
      // Should have 9 parts: 3 variants × 3 formats
      expect(parts.length).toBe(9);
      
      // First 3 should be AVIF
      expect(parts.slice(0, 3).every(p => p.includes('.avif'))).toBe(true);
      // Next 3 should be WebP
      expect(parts.slice(3, 6).every(p => p.includes('.webp'))).toBe(true);
      // Last 3 should be JPEG
      expect(parts.slice(6, 9).every(p => p.includes('.jpeg'))).toBe(true);
    });

    it('prioritizes high-DPI variants (large, xlarge, original)', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Check that it doesn't include thumbnail or medium
      expect(srcset).not.toContain('thumbnail');
      expect(srcset).not.toContain('medium');
    });

    it('returns empty string for empty input', () => {
      expect(generateLightboxSrcSet('')).toBe('');
      expect(generateLightboxSrcSet(null as any)).toBe('');
    });

    it('generates correct format: URL followed by width descriptor', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Each part should match pattern: URL space width
      parts.forEach(part => {
        expect(part).toMatch(/^https:\/\/.+\.(webp|jpeg|avif) \d+w$/);
      });
    });
  });

  describe('Helper functions', () => {
    it('getCoverImageUrl returns large WebP variant', () => {
      const result = getCoverImageUrl(mockOriginalUrl);
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-large.webp');
    });

    it('getLightboxImageUrl returns xlarge WebP variant', () => {
      const result = getLightboxImageUrl(mockOriginalUrl);
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-xlarge.webp');
    });

    it('getThumbnailUrl returns thumbnail WebP variant', () => {
      const result = getThumbnailUrl(mockOriginalUrl);
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-thumbnail.webp');
    });

    it('helper functions return null for null input', () => {
      expect(getCoverImageUrl(null)).toBeNull();
      expect(getLightboxImageUrl(null)).toBeNull();
      expect(getThumbnailUrl(null)).toBeNull();
    });
  });

  describe('Size attribute construction validation', () => {
    it('srcset width descriptors match expected variant sizes', () => {
      const srcset = generateSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Extract width descriptors
      const widthDescriptorMap: Record<string, number> = {
        'thumbnail': 400,
        'medium': 1200,
        'large': 2400,
        'xlarge': 4000,
      };
      
      // Verify each variant has correct width descriptor
      Object.entries(widthDescriptorMap).forEach(([variant, expectedWidth]) => {
        // Use word boundary or path separator to avoid matching "xlarge" when checking "large"
        const variantPattern = new RegExp(`-${variant}\\.(webp|jpeg|avif)`);
        const variantParts = parts.filter(p => variantPattern.test(p));
        variantParts.forEach(part => {
          const width = parseInt(part.match(/(\d+)w$/)![1], 10);
          expect(width).toBe(expectedWidth);
        });
      });
    });

    it('lightbox srcset uses high-DPI widths (2400w and 4000w only)', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      parts.forEach(part => {
        const width = parseInt(part.match(/(\d+)w$/)![1], 10);
        expect([2400, 4000]).toContain(width);
      });
    });

    it('srcset format matches HTML5 srcset specification', () => {
      const srcset = generateSrcSet(mockOriginalUrl);
      
      // Should be comma-space separated
      expect(srcset).toMatch(/^https:\/\/.+, https:\/\/.+$/);
      
      // Each entry should have URL space width
      const entries = srcset.split(', ');
      entries.forEach(entry => {
        expect(entry).toMatch(/^https:\/\/.+\s\d+w$/);
      });
    });
  });
});

