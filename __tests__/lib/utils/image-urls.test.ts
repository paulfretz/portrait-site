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
  getLightboxImageUrlJpeg,
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
      
      // Should contain xlarge and original (when original > 4000px)
      expect(srcset).toContain('xlarge');
      // With null width (defaults to 8000px), original is included
      expect(srcset).toContain('original');
    });

    it('uses correct width descriptors for lightbox variants', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Lightbox now includes fallback variants: xlarge (4000), large (2400), medium (1200), thumbnail (400), original (8000)
      const widths = parts.map(part => parseInt(part.match(/(\d+)w$/)![1], 10));
      expect(widths).toContain(4000); // xlarge
      expect(widths).toContain(2400); // large (fallback)
      expect(widths).toContain(1200); // medium (fallback)
      expect(widths).toContain(400);  // thumbnail (fallback)
      expect(widths).toContain(8000); // original (default when width unknown)
    });

    it('includes WebP and JPEG formats by default', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Should have 10 parts: 5 variants (xlarge + large + medium + thumbnail + original) × 2 formats
      expect(parts.length).toBe(10);
      
      // First 5 should be WebP (all variants)
      expect(parts.slice(0, 5).every(p => p.includes('.webp'))).toBe(true);
      // Last 5 should be JPEG (all variants)
      expect(parts.slice(5, 10).every(p => p.includes('.jpeg'))).toBe(true);
    });

    it('includes AVIF format when includeAvif is true', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl, null, true);
      const parts = srcset.split(', ');
      
      // Should have 15 parts: 5 variants (xlarge + large + medium + thumbnail + original) × 3 formats
      // With null width (defaults to 8000px), original is included
      expect(parts.length).toBe(15);
      
      // First 5 should be AVIF (all variants)
      expect(parts.slice(0, 5).every(p => p.includes('.avif'))).toBe(true);
      // Next 5 should be WebP (all variants)
      expect(parts.slice(5, 10).every(p => p.includes('.webp'))).toBe(true);
      // Last 5 should be JPEG (all variants)
      expect(parts.slice(10, 15).every(p => p.includes('.jpeg'))).toBe(true);
    });

    it('orders formats AVIF → WebP → JPEG with proper fallback chain', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl, null, true);
      const parts = srcset.split(', ');
      
      // Verify strict ordering: all AVIF first, then all WebP, then all JPEG
      // This ensures browser tries AVIF first, falls back to WebP, then JPEG
      const avifIndex = parts.findIndex(p => p.includes('.avif'));
      const webpIndex = parts.findIndex(p => p.includes('.webp'));
      const jpegIndex = parts.findIndex(p => p.includes('.jpeg'));
      
      expect(avifIndex).toBeLessThan(webpIndex);
      expect(webpIndex).toBeLessThan(jpegIndex);
      
      // All AVIF should come before any WebP
      const lastAvifIndex = parts.map((p, i) => p.includes('.avif') ? i : -1).filter(i => i >= 0).pop()!;
      const firstWebpIndex = parts.findIndex(p => p.includes('.webp'));
      expect(lastAvifIndex).toBeLessThan(firstWebpIndex);
      
      // All WebP should come before any JPEG
      const lastWebpIndex = parts.map((p, i) => p.includes('.webp') ? i : -1).filter(i => i >= 0).pop()!;
      const firstJpegIndex = parts.findIndex(p => p.includes('.jpeg'));
      expect(lastWebpIndex).toBeLessThan(firstJpegIndex);
    });

    it('includes original variant even when image width is less than 4000px (for fallback)', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl, 3000);
      const parts = srcset.split(', ');
      
      // Should have 10 parts: all variants (xlarge + large + medium + thumbnail + original) × 2 formats
      // Original is always included as final fallback for backward compatibility
      expect(parts.length).toBe(10);
      expect(srcset).toContain('xlarge');
      expect(srcset).toContain('original');
      expect(srcset).toContain('3000w'); // Original uses actual width
    });

    it('includes original variant when image width is greater than 4000px', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl, 6000);
      const parts = srcset.split(', ');
      
      // Should have 10 parts: all variants (xlarge + large + medium + thumbnail + original) × 2 formats
      expect(parts.length).toBe(10);
      expect(srcset).toContain('xlarge');
      expect(srcset).toContain('original');
      
      // Original should use actual width descriptor (6000w)
      expect(srcset).toContain('6000w');
    });

    it('includes fallback variants for backward compatibility', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl);
      const parts = srcset.split(', ');
      
      // Should include all variants (xlarge, large, medium, thumbnail, original) for fallback
      // This ensures existing images with only thumbnails still work
      expect(srcset).toContain('xlarge');
      expect(srcset).toContain('large');
      expect(srcset).toContain('medium');
      expect(srcset).toContain('thumbnail');
      expect(srcset).toContain('original');
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

    it('getLightboxImageUrl returns xlarge WebP variant by default', () => {
      const result = getLightboxImageUrl(mockOriginalUrl);
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-xlarge.webp');
    });

    it('getLightboxImageUrl returns original WebP when image width is less than 4000px', () => {
      const result = getLightboxImageUrl(mockOriginalUrl, 3000);
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-original.webp');
    });

    it('getLightboxImageUrl returns xlarge WebP when image width is 4000px or larger', () => {
      const result = getLightboxImageUrl(mockOriginalUrl, 5000);
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-xlarge.webp');
    });

    it('getLightboxImageUrlJpeg returns original JPEG fallback (universal browser support)', () => {
      const result = getLightboxImageUrlJpeg(mockOriginalUrl);
      // Changed to original.jpeg as safe fallback (always exists, browser will use srcset if available)
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-original.jpeg');
    });

    it('getLightboxImageUrlJpeg returns original JPEG when image width is less than 4000px', () => {
      const result = getLightboxImageUrlJpeg(mockOriginalUrl, 3000);
      expect(result).toBe('https://example.com/galleries/gallery1/1234567890-photo-original.jpeg');
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

    it('lightbox srcset includes high-DPI widths and fallback variants', () => {
      const srcset = generateLightboxSrcSet(mockOriginalUrl, 6000);
      const parts = srcset.split(', ');
      
      const widths = parts.map(part => parseInt(part.match(/(\d+)w$/)![1], 10));
      
      // Should include xlarge (4000), large (2400), medium (1200), thumbnail (400), and original (6000)
      // This ensures backward compatibility with existing images that only have thumbnails
      expect(widths).toContain(4000); // xlarge
      expect(widths).toContain(6000); // original (from imageWidth param)
      expect(widths).toContain(2400); // large (fallback)
      expect(widths).toContain(1200); // medium (fallback)
      expect(widths).toContain(400);  // thumbnail (fallback)
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

