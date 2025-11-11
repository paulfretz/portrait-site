'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Masonry from 'react-masonry-css';
import { OptimizedImage } from './OptimizedImage';
import { GalleryLightbox } from './GalleryLightbox';
import { Image as ImageType } from '@/lib/db/types';
import { useJustifiedLayout } from '@/lib/hooks/useJustifiedLayout';
import { getImageVariantUrl } from '@/lib/utils/image-urls';

interface PhotoGridProps {
  images: ImageType[];
  galleryTitle: string;
}

export function PhotoGrid({ images, galleryTitle }: PhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Detect screen size
  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            updateWidth();
          })
        : null;

    if (observer) {
      observer.observe(element);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
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

  const desktopLayoutWidth = useMemo(() => {
    const measuredContainer = Math.max(0, Math.round(containerWidth));

    if (!justifiedLayout || justifiedLayout.boxes.length === 0) {
      return measuredContainer;
    }

    const maxRightEdge = justifiedLayout.boxes.reduce((max, box) => {
      return Math.max(max, box.left + box.width);
    }, 0);

    return Math.max(measuredContainer, Math.round(maxRightEdge));
  }, [justifiedLayout, containerWidth]);

  const mobileLayoutWidth = Math.max(0, Math.round(containerWidth));

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
      <div className="px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="mx-auto w-full max-w-7xl">
          {/* Mobile: Masonry Layout (2 columns) */}
          {isMobile && (
            <div className="flex justify-center">
              <div style={{ width: `${mobileLayoutWidth}px` }}>
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
                      <div
                        className="relative w-full"
                        style={{
                          paddingBottom: image.height && image.width
                            ? `${(image.height / image.width) * 100}%`
                            : '75%',
                        }}
                      >
                        <OptimizedImage
                          src={getImageVariantUrl(image.url, 'medium', 'jpeg')}
                          alt={image.alt_text || galleryTitle}
                          blurDataUrl={image.blur_data_url}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 767px) calc((100vw - 32px) / 2), (max-width: 1023px) calc((100vw - 160px) / 3), 33vw"
                        />
                      </div>
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
              </div>
            </div>
          )}

          {/* Desktop: Justified Row Layout */}
          {!isMobile && justifiedLayout && (
            <div className="flex justify-center">
              <div
                className="relative"
                style={{
                  height: justifiedLayout.containerHeight,
                  width: `${desktopLayoutWidth}px`,
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
                        src={getImageVariantUrl(image.url, 'large', 'jpeg')}
                        alt={image.alt_text || galleryTitle}
                        blurDataUrl={image.blur_data_url}
                        width={box.width}
                        height={box.height}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes={`${Math.ceil(box.width)}px`}
                      />
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
            </div>
          )}
        </div>
      </div>

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

