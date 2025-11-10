/**
 * Image URL Utilities
 * Helper functions for generating variant URLs from stored image URLs
 */

export type ImageVariant = 'thumbnail' | 'medium' | 'large' | 'xlarge' | 'original';
export type ImageFormat = 'jpeg' | 'webp' | 'avif';

/**
 * Get a specific variant URL from the original stored URL
 * 
 * The database stores the original-jpeg URL. This function generates
 * URLs for other sizes/formats by replacing the size and format suffix.
 *
 * @param originalUrl - The stored URL (e.g., 'https://.../photo-original.jpeg')
 * @param variant - The desired size variant
 * @param format - The desired format (defaults to 'webp' for modern browsers)
 * @returns The variant URL
 *
 * @example
 * getImageVariantUrl('https://blob.../photo-original.jpeg', 'large', 'webp')
 * // Returns: 'https://blob.../photo-large.webp'
 */
export function getImageVariantUrl(
  originalUrl: string,
  variant: ImageVariant = 'large',
  format: ImageFormat = 'webp'
): string {
  if (!originalUrl) return originalUrl;

  // Handle both -original and -thumbnail URLs (for backward compatibility)
  // First try to replace -original
  if (/-original\.(jpeg|jpg|png|webp)/i.test(originalUrl)) {
    return originalUrl.replace(/-original\.(jpeg|jpg|png|webp)/i, `-${variant}.${format}`);
  }
  
  // If original URL has -thumbnail (legacy format), replace it
  if (/-thumbnail\.(jpeg|jpg|png|webp)/i.test(originalUrl)) {
    return originalUrl.replace(/-thumbnail\.(jpeg|jpg|png|webp)/i, `-${variant}.${format}`);
  }
  
  // If no pattern matches, return original URL (shouldn't happen, but safe fallback)
  return originalUrl;
}

/**
 * Get the best cover image URL for display in gallery grids
 * Uses 'large' size with WebP format for optimal quality and performance
 * Falls back to smaller variants if large doesn't exist (for backward compatibility)
 * 
 * @param originalUrl - The stored URL from the database
 * @returns High-quality cover image URL (prefers large-webp, falls back gracefully)
 */
export function getCoverImageUrl(originalUrl: string | null): string | null {
  if (!originalUrl) return null;
  
  // Return large.webp as preferred
  // If it doesn't exist (404), Next.js Image component will fall back to the src attribute
  // For existing images with only thumbnails, we should update GalleryGrid to use srcset
  // For now, this ensures we try the best quality first
  return getImageVariantUrl(originalUrl, 'large', 'webp');
}

/**
 * Get the best lightbox image URL for full-screen viewing
 * Serves xlarge (~4000px) or original when smaller (avoids upscaling)
 * Uses WebP format for optimal compression
 * 
 * @param originalUrl - The stored URL from the database
 * @param imageWidth - The width of the original image (null if unknown)
 * @returns Highest quality image URL (xlarge-webp or original-webp when smaller)
 */
export function getLightboxImageUrl(
  originalUrl: string | null, 
  imageWidth: number | null = null
): string | null {
  if (!originalUrl) return null;
  
  // If we know the image width and it's smaller than 4000px, use original
  // Otherwise use xlarge (which is capped at 4000px)
  // This ensures we don't upscale and always serve the highest quality available
  if (imageWidth && imageWidth > 0 && imageWidth < 4000) {
    return getImageVariantUrl(originalUrl, 'original', 'webp');
  }
  
  // Default to xlarge for high-res displays
  return getImageVariantUrl(originalUrl, 'xlarge', 'webp');
}

/**
 * Get JPEG fallback URL for lightbox (universal browser support)
 * Used as the `src` attribute fallback when using srcset
 * Serves xlarge (~4000px) or original when smaller
 * Falls back to smaller variants if preferred sizes don't exist
 * 
 * @param originalUrl - The stored URL from the database
 * @param imageWidth - The width of the original image (null if unknown)
 * @returns JPEG fallback URL with fallback chain (xlarge → large → medium → thumbnail → original)
 */
export function getLightboxImageUrlJpeg(
  originalUrl: string | null,
  imageWidth: number | null = null
): string | null {
  if (!originalUrl) return null;
  
  // Prefer xlarge JPEG when the source image is large enough to avoid downloading the full original
  const shouldUseOriginal = imageWidth && imageWidth > 0 && imageWidth < 4000;
  const preferredVariant: ImageVariant = shouldUseOriginal ? 'original' : 'xlarge';

  return getImageVariantUrl(originalUrl, preferredVariant, 'jpeg');
}

/**
 * Get thumbnail URL for admin previews and small displays
 * 
 * @param originalUrl - The stored URL from the database
 * @returns Thumbnail URL (thumbnail-webp)
 */
export function getThumbnailUrl(originalUrl: string | null): string | null {
  if (!originalUrl) return null;
  return getImageVariantUrl(originalUrl, 'thumbnail', 'webp');
}

/**
 * Generate srcset attribute for responsive images with multi-format support
 * Creates a srcset with multiple size variants in AVIF → WebP → JPEG order
 * 
 * @param originalUrl - The stored URL from the database
 * @param includeAvif - Whether to include AVIF format (defaults to false until pipeline supports it)
 * @returns srcset string for use in <img> or Next.js Image with format priority
 *
 * @example
 * generateSrcSet('https://blob.../photo-original.jpeg')
 * // Returns: 'https://.../photo-thumbnail.webp 400w, https://.../photo-medium.webp 1200w, ...'
 */
export function generateSrcSet(originalUrl: string, includeAvif: boolean = false): string {
  if (!originalUrl) return '';

  const variants: Array<{ name: ImageVariant; width: number }> = [
    { name: 'thumbnail', width: 400 },
    { name: 'medium', width: 1200 },
    { name: 'large', width: 2400 },
    { name: 'xlarge', width: 4000 },
  ];

  // Format priority: AVIF → WebP → JPEG
  const formats: ImageFormat[] = includeAvif 
    ? ['avif', 'webp', 'jpeg'] 
    : ['webp', 'jpeg'];

  const srcsetParts: string[] = [];

  for (const format of formats) {
    for (const variant of variants) {
      const url = getImageVariantUrl(originalUrl, variant.name, format);
      srcsetParts.push(`${url} ${variant.width}w`);
    }
  }

  return srcsetParts.join(', ');
}

/**
 * Get the width descriptor for original image
 * Uses the image's actual width if available, otherwise estimates based on common photography sizes
 * 
 * @param imageWidth - The width of the original image (null if unknown)
 * @returns Width descriptor (defaults to 8000px for high-res photography)
 */
function getOriginalWidthDescriptor(imageWidth: number | null): number {
  // If we know the actual width, use it
  if (imageWidth && imageWidth > 0) {
    return imageWidth;
  }
  // Default to 8000px for high-res photography (matches PRD 0003 requirement)
  return 8000;
}

/**
 * Generate multi-format srcset for lightbox (AVIF → WebP → JPEG)
 * Creates optimized srcsets with format priority for high-DPI displays
 * Serves xlarge (~4000px) or original when smaller; includes 1x/2x width candidates
 * 
 * @param originalUrl - The stored URL from the database
 * @param imageWidth - The width of the original image (null if unknown)
 * @param includeAvif - Whether to include AVIF format (defaults to false until pipeline supports it)
 * @returns srcset string with AVIF, WebP, and JPEG formats (browser chooses best)
 *
 * @example
 * generateLightboxSrcSet('https://blob.../photo-original.jpeg', 6000)
 * // Returns: 'https://.../photo-xlarge.avif 4000w, https://.../photo-original.avif 6000w, ...'
 */
export function generateLightboxSrcSet(
  originalUrl: string, 
  imageWidth: number | null = null,
  includeAvif: boolean = false
): string {
  if (!originalUrl) return '';

  const originalWidth = getOriginalWidthDescriptor(imageWidth);
  
  // For lightbox, prefer xlarge (~4000px) and original
  // BUT: Include fallback variants for existing images that only have thumbnails
  // Browser will skip 404s and use the next available variant
  // Order: xlarge → large → medium → thumbnail → original
  const variants: Array<{ name: ImageVariant; width: number }> = [
    { name: 'xlarge', width: 4000 },
    { name: 'large', width: 2400 },
    { name: 'medium', width: 1200 },
    { name: 'thumbnail', width: 400 },
    // Always include original as final fallback (at actual width)
    { name: 'original' as ImageVariant, width: originalWidth },
  ];

  // Format priority: AVIF → WebP → JPEG
  const formats: ImageFormat[] = includeAvif 
    ? ['avif', 'webp', 'jpeg'] 
    : ['webp', 'jpeg'];

  const srcsetParts: string[] = [];

  for (const format of formats) {
    for (const variant of variants) {
      const url = getImageVariantUrl(originalUrl, variant.name, format);
      srcsetParts.push(`${url} ${variant.width}w`);
    }
  }

  return srcsetParts.join(', ');
}

