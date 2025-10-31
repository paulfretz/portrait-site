'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
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
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Refs for focus management
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

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

  // Keyboard navigation (desktop and mobile with external keyboards)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // Touch handlers for swipe gestures (mobile support)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    setTouchEnd(currentX);
    
    // Prevent vertical scrolling while swiping horizontally
    const horizontalDistance = Math.abs(touchStart.x - currentX);
    const verticalDistance = Math.abs(touchStart.y - currentY);
    
    // If horizontal swipe is dominant, prevent default scroll behavior
    if (horizontalDistance > verticalDistance && horizontalDistance > 10) {
      e.preventDefault();
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart.x - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
    
    // Reset touch tracking
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Focus management and body scroll prevention
  useEffect(() => {
    if (isOpen) {
      // Save the element that had focus before opening
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the close button when lightbox opens (first interactive element)
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Restore focus to the previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen]);

  // Focus trapping - keep focus within lightbox
  useEffect(() => {
    if (!isOpen || !lightboxRef.current) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = lightboxRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab (backwards)
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forwards)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const imageTitle = currentImage?.alt_text || `${galleryTitle} - Image ${currentIndex + 1}`;

  return (
    <div
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-description"
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Screen reader only title and description */}
      <div className="sr-only">
        <h2 id="lightbox-title">Image Gallery Lightbox</h2>
        <p id="lightbox-description">
          Viewing image {currentIndex + 1} of {images.length}. {imageTitle}. Use arrow keys to navigate, Escape to close.
        </p>
      </div>
      {/* Close button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white hover:text-sage-300 transition-colors p-2 rounded-full hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Close lightbox (Escape)"
        type="button"
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

      {/* Previous button - larger tap target on mobile */}
      {images.length > 1 && (
        <button
          ref={previousButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-sage-300 transition-colors p-3 sm:p-3 md:p-4 rounded-full hover:bg-white/10 min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-2 focus:ring-offset-black"
          aria-label={`Previous image (Left arrow key) - Image ${currentIndex === 0 ? images.length : currentIndex} of ${images.length}`}
          type="button"
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

      {/* Next button - larger tap target on mobile */}
      {images.length > 1 && (
        <button
          ref={nextButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-sage-300 transition-colors p-3 sm:p-3 md:p-4 rounded-full hover:bg-white/10 min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-2 focus:ring-offset-black"
          aria-label={`Next image (Right arrow key) - Image ${currentIndex === images.length - 1 ? 1 : currentIndex + 2} of ${images.length}`}
          type="button"
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
        className="relative w-full h-full flex items-center justify-center"
        style={{ padding: '12px' }}
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

        {/* Image container with viewport-fit scaling - max display rect = viewport minus 12px border */}
        <div 
          className="relative flex items-center justify-center"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: 'calc(100vw - 24px)', // 12px padding on each side = 24px total
            maxHeight: 'calc(100vh - 24px)', // 12px padding on each side = 24px total
          }}
        >
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 scrollbar-hide" role="toolbar" aria-label="Image thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsLoading(true);
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-2 focus:ring-offset-black ${
                index === currentIndex
                  ? 'ring-2 ring-sage-300 opacity-100'
                  : 'opacity-50 hover:opacity-75'
              }`}
              aria-label={`View image ${index + 1}${index === currentIndex ? ' (current)' : ''}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
              type="button"
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

