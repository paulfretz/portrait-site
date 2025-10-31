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

  // Replace -original.jpeg with the desired variant and format
  return originalUrl
    .replace(/-original\.(jpeg|jpg|png|webp)$/i, `-${variant}.${format}`)
    .replace(/-original\.jpeg$/i, `-${variant}.${format}`);
}

/**
 * Get the best cover image URL for display in gallery grids
 * Uses 'large' size with WebP format for optimal quality and performance
 * 
 * @param originalUrl - The stored URL from the database
 * @returns High-quality cover image URL (large-webp)
 */
export function getCoverImageUrl(originalUrl: string | null): string | null {
  if (!originalUrl) return null;
  return getImageVariantUrl(originalUrl, 'large', 'webp');
}

/**
 * Get the best lightbox image URL for full-screen viewing
 * Uses 'xlarge' size with WebP format for high-DPI displays
 * 
 * @param originalUrl - The stored URL from the database
 * @returns Highest quality image URL (xlarge-webp)
 */
export function getLightboxImageUrl(originalUrl: string | null): string | null {
  if (!originalUrl) return null;
  return getImageVariantUrl(originalUrl, 'xlarge', 'webp');
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
 * Generate multi-format srcset for lightbox (AVIF → WebP → JPEG)
 * Creates optimized srcsets with format priority for high-DPI displays
 * 
 * @param originalUrl - The stored URL from the database
 * @param includeAvif - Whether to include AVIF format (defaults to false until pipeline supports it)
 * @returns srcset string with AVIF, WebP, and JPEG formats (browser chooses best)
 *
 * @example
 * generateLightboxSrcSet('https://blob.../photo-original.jpeg')
 * // Returns: 'https://.../photo-xlarge.avif 4000w, https://.../photo-xlarge.webp 4000w, ...'
 */
export function generateLightboxSrcSet(originalUrl: string, includeAvif: boolean = false): string {
  if (!originalUrl) return '';

  // For lightbox, prioritize xlarge and original for high-DPI displays
  const variants: Array<{ name: ImageVariant; width: number }> = [
    { name: 'large', width: 2400 },
    { name: 'xlarge', width: 4000 },
    { name: 'original', width: 4000 }, // Use xlarge width as descriptor for original
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

