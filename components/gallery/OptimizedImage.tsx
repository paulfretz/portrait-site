import Image from 'next/image';
import { useState } from 'react';

/**
 * Optimized Image Component
 * Wrapper around Next.js Image with lazy loading and blur placeholder
 *
 * Features:
 * - Lazy loading (loads when in viewport)
 * - Blur placeholder while loading
 * - Automatic srcset generation
 * - Responsive sizing
 * - Error handling with fallback
 *
 * Usage:
 * ```tsx
 * <OptimizedImage
 *   src={image.url}
 *   alt={image.alt_text}
 *   width={image.width}
 *   height={image.height}
 *   priority={false}
 * />
 * ```
 *
 * @component
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes,
  fill = false,
  objectFit = 'cover',
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle image load complete
  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Error fallback
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <div className="text-center p-4">
          <svg
            className="w-12 h-12 mx-auto text-neutral-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-neutral-500">Image unavailable</p>
        </div>
      </div>
    );
  }

  // Render with fill
  if (fill) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          className={`${className} ${objectFit === 'cover' ? 'object-cover' : `object-${objectFit}`} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoadComplete}
          onError={handleError}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
        />
      </>
    );
  }

  // Render with explicit dimensions
  if (width && height) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div
            className="absolute inset-0 bg-neutral-100 animate-pulse"
            style={{ width, height }}
          />
        )}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoadComplete}
          onError={handleError}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
        />
      </div>
    );
  }

  // Fallback: render with CSS dimensions
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        sizes={sizes || '100vw'}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoadComplete}
        onError={handleError}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
      />
    </div>
  );
}

