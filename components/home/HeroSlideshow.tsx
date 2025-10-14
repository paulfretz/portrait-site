'use client';

import { useState, useEffect } from 'react';
import { OptimizedImage } from '@/components/gallery/OptimizedImage';
import { Image } from '@/lib/db/types';
import { getHeroImages } from '@/lib/db/queries';
import { getLightboxImageUrl } from '@/lib/utils/image-urls';

/**
 * Hero Slideshow Component
 * Full-screen slideshow with automatic transitions and manual controls
 *
 * Features:
 * - Fetches photographer's hero images from database
 * - Automatic slideshow with configurable interval
 * - Manual navigation (prev/next arrows)
 * - Pause/play toggle
 * - Keyboard navigation (arrow keys, spacebar)
 * - High-resolution images (xlarge variant)
 * - Blur placeholders for progressive loading
 * - Responsive design
 * - Loading states
 *
 * @component
 */
export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [heroImages, setHeroImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch hero images from database
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const images = await getHeroImages();
        setHeroImages(images);
      } catch (err) {
        console.error('Error fetching hero images:', err);
        setError('Failed to load hero images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Use hero images if available, otherwise show empty state
  const slides = heroImages.length > 0 ? heroImages : [];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'Escape':
          e.preventDefault();
          setIsPlaying(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-neutral-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-neutral-900 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <p className="text-xl mb-4">Failed to load hero images</p>
          <p className="text-sm opacity-75">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state if no hero images
  if (slides.length === 0) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-sage-900 to-neutral-900 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <p className="text-4xl md:text-6xl font-light mb-4 tracking-wide">
            DJ Coveno Portraits
          </p>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Montana Portrait Photography
          </p>
          <p className="text-sm opacity-75">
            Add hero images in the admin dashboard to display them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slideshow Images */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <OptimizedImage
              src={getLightboxImageUrl(slide.url) || slide.url}
              alt={slide.alt_text || 'Hero image'}
              blurDataUrl={slide.blur_data_url}
              fill
              className="object-cover"
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              onLoad={index === 0 ? handleImageLoad : undefined}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            
            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <p className="text-4xl md:text-6xl font-light mb-4 tracking-wide">
                  DJ Coveno Portraits
                </p>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  Montana Portrait Photography
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
          <div className="text-white text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Navigation Arrows - Only show if multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Play/Pause Button - Only show if multiple slides */}
      {slides.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* Slide Indicators - Only show if multiple slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Keyboard Instructions */}
      <div className="absolute top-4 right-4 text-white text-sm opacity-75 hidden md:block">
        <p>Use ← → arrows or spacebar to navigate</p>
      </div>
    </div>
  );
}
