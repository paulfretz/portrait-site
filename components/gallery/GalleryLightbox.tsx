'use client';

import { useEffect, useCallback, useState } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { Image as ImageType } from '@/lib/db/types';
import { getLightboxImageUrl } from '@/lib/utils/image-urls';

interface GalleryLightboxProps {
  images: ImageType[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  galleryTitle: string;
}

export function GalleryLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  galleryTitle,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsLoading(true);
  }, [initialIndex]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsLoading(true);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsLoading(true);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white hover:text-sage-300 transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-50 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-sage-300 transition-colors p-3 rounded-full hover:bg-white/10"
          aria-label="Previous image"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-sage-300 transition-colors p-3 rounded-full hover:bg-white/10"
          aria-label="Next image"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Main image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-sage-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Image */}
        <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
          <OptimizedImage
            src={getLightboxImageUrl(currentImage.url) || currentImage.url}
            alt={currentImage.alt_text || galleryTitle}
            blurDataUrl={currentImage.blur_data_url}
            fill
            className="object-contain"
            sizes="100vw"
            priority
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Image caption */}
        {currentImage.alt_text && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
            <p className="text-white text-sm md:text-base">{currentImage.alt_text}</p>
          </div>
        )}
      </div>

      {/* Keyboard instructions (desktop only) */}
      <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center">
        <p>Use arrow keys to navigate • ESC to close</p>
      </div>

      {/* Thumbnail strip (optional, for larger galleries) */}
      {images.length > 1 && images.length <= 20 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsLoading(true);
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-sage-300 opacity-100'
                  : 'opacity-50 hover:opacity-75'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <OptimizedImage
                src={image.url}
                alt={image.alt_text || `${galleryTitle} - Image ${index + 1}`}
                blurDataUrl={image.blur_data_url}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

