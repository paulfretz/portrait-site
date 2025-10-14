import sharp from 'sharp';

/**
 * Image Optimization Utilities
 * Generates web-optimized and responsive image sizes using Sharp
 *
 * Generates:
 * - Thumbnail: 400px width
 * - Medium: 1200px width
 * - Large: 2400px width
 * - XLarge: 4000px width (for high-DPI displays and professional viewing)
 * - Original: unchanged
 *
 * Formats:
 * - JPEG (quality 85-95 depending on size)
 * - WebP (for modern browsers)
 */

export interface ImageSize {
  name: 'thumbnail' | 'medium' | 'large' | 'xlarge' | 'original';
  width: number | null; // null = original size
  buffer: Buffer;
  format: 'jpeg' | 'webp';
  dimensions: {
    width: number;
    height: number;
  };
}

export interface OptimizedImageSet {
  sizes: ImageSize[];
  originalDimensions: {
    width: number;
    height: number;
  };
}

/**
 * Optimize a single image and generate multiple sizes
 *
 * @param buffer - Original image buffer
 * @returns OptimizedImageSet with all sizes in JPEG and WebP
 */
export async function optimizeImage(buffer: Buffer): Promise<OptimizedImageSet> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read image dimensions');
  }

  const originalDimensions = {
    width: metadata.width,
    height: metadata.height,
  };

  const sizes: ImageSize[] = [];

  // Define size configurations
  const sizeConfigs: Array<{ name: 'thumbnail' | 'medium' | 'large' | 'xlarge'; width: number }> = [
    { name: 'thumbnail', width: 400 },
    { name: 'medium', width: 1200 },
    { name: 'large', width: 2400 },
    { name: 'xlarge', width: 4000 }, // For high-DPI displays and professional viewing
  ];

  // Generate each size in both JPEG and WebP
  for (const config of sizeConfigs) {
    // Skip if original image is smaller than target size
    if (metadata.width < config.width) {
      continue;
    }

    const resized = sharp(buffer).resize(config.width, null, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    const resizedMetadata = await resized.metadata();

    // JPEG version
    const jpegBuffer = await resized
      .jpeg({
        quality: 85,
        mozjpeg: true, // Use mozjpeg for better compression
      })
      .toBuffer();

    sizes.push({
      name: config.name,
      width: config.width,
      buffer: jpegBuffer,
      format: 'jpeg',
      dimensions: {
        width: resizedMetadata.width || config.width,
        height: resizedMetadata.height || Math.round((config.width * originalDimensions.height) / originalDimensions.width),
      },
    });

    // WebP version
    const webpBuffer = await resized
      .webp({
        quality: 85,
      })
      .toBuffer();

    sizes.push({
      name: config.name,
      width: config.width,
      buffer: webpBuffer,
      format: 'webp',
      dimensions: {
        width: resizedMetadata.width || config.width,
        height: resizedMetadata.height || Math.round((config.width * originalDimensions.height) / originalDimensions.width),
      },
    });
  }

  // Original size in both formats
  const originalJpeg = await sharp(buffer)
    .jpeg({
      quality: 85,
      mozjpeg: true,
    })
    .toBuffer();

  sizes.push({
    name: 'original',
    width: null,
    buffer: originalJpeg,
    format: 'jpeg',
    dimensions: originalDimensions,
  });

  const originalWebp = await sharp(buffer)
    .webp({
      quality: 85,
    })
    .toBuffer();

  sizes.push({
    name: 'original',
    width: null,
    buffer: originalWebp,
    format: 'webp',
    dimensions: originalDimensions,
  });

  return {
    sizes,
    originalDimensions,
  };
}

/**
 * Get image dimensions without full optimization
 * Useful for quick metadata extraction
 *
 * @param buffer - Image buffer
 * @returns Width and height in pixels
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read image dimensions');
  }

  return {
    width: metadata.width,
    height: metadata.height,
  };
}

/**
 * Generate a filename for optimized image
 *
 * @param originalFilename - Original file name
 * @param size - Size name (thumbnail, medium, large, original)
 * @param format - Image format (jpeg, webp)
 * @returns New filename with size and format suffix
 *
 * @example
 * generateOptimizedFilename('photo.jpg', 'thumbnail', 'webp')
 * // Returns: 'photo-thumbnail.webp'
 */
export function generateOptimizedFilename(
  originalFilename: string,
  size: string,
  format: string
): string {
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}-${size}.${format}`;
}

