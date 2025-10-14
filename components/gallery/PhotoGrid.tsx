'use client';

import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { OptimizedImage } from './OptimizedImage';
import { GalleryLightbox } from './GalleryLightbox';
import { Image as ImageType } from '@/lib/db/types';
import { useJustifiedLayout } from '@/lib/hooks/useJustifiedLayout';

interface PhotoGridProps {
  images: ImageType[];
  galleryTitle: string;
}

export function PhotoGrid({ images, galleryTitle }: PhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setContainerWidth(window.innerWidth);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate justified layout for desktop
  const justifiedLayout = useJustifiedLayout(images, containerWidth, 320, 8);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-sage-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-sage-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Photos Yet</h3>
          <p className="text-gray-600">
            Photos for this gallery are being prepared. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  // Masonry breakpoints configuration (for mobile)
  const breakpointColumns = {
    default: 2, // Mobile/Tablet: 2 columns
    768: 2,
  };

  return (
    <>
      {/* Mobile: Masonry Layout (2 columns) */}
      {isMobile && (
        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className="group relative w-full overflow-hidden bg-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              {/* Calculate aspect ratio from image dimensions */}
              <div
                className="relative w-full"
                style={{
                  paddingBottom: image.height && image.width 
                    ? `${(image.height / image.width) * 100}%` 
                    : '75%',
                }}
              >
                <OptimizedImage
                  src={image.url}
                  alt={image.alt_text || galleryTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="50vw"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </Masonry>
      )}

      {/* Desktop: Justified Row Layout */}
      {!isMobile && justifiedLayout && (
        <div
          className="relative"
          style={{
            height: justifiedLayout.containerHeight,
          }}
        >
          {images.map((image, index) => {
            const box = justifiedLayout.boxes[index];
            if (!box) return null;

            return (
              <button
                key={image.id}
                onClick={() => openLightbox(index)}
                className="group absolute overflow-hidden bg-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300"
                style={{
                  top: box.top,
                  left: box.left,
                  width: box.width,
                  height: box.height,
                }}
              >
                <OptimizedImage
                  src={image.url}
                  alt={image.alt_text || galleryTitle}
                  width={box.width}
                  height={box.height}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(min-width: 768px) 33vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      <GalleryLightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        galleryTitle={galleryTitle}
      />
    </>
  );
}

