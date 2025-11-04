'use client';

import { useEffect, useState, useMemo } from 'react';
import justifiedLayout from 'justified-layout';
import type { Image } from '@/lib/db/types';

export interface JustifiedLayoutBox {
  aspectRatio: number;
  top: number;
  width: number;
  height: number;
  left: number;
}

export interface JustifiedLayoutGeometry {
  containerHeight: number;
  boxes: JustifiedLayoutBox[];
}

/**
 * Custom hook for calculating justified gallery layout
 * Uses Flickr's justified-layout algorithm to create rows where all images have the same height
 * 
 * @param images - Array of images with dimensions
 * @param containerWidth - Width of the container (defaults to window width)
 * @param targetRowHeight - Desired row height (will be adjusted for optimal fitting)
 * @param boxSpacing - Gap between images in pixels
 * @returns Layout geometry with box positions and dimensions
 */
export function useJustifiedLayout(
  images: Image[],
  containerWidth?: number,
  targetRowHeight: number = 300,
  boxSpacing: number = 8
): JustifiedLayoutGeometry | null {
  const [width, setWidth] = useState(containerWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200));

  // Update width on window resize
  useEffect(() => {
    if (containerWidth) return; // Use fixed width if provided

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerWidth]);

  // Calculate layout when images or width changes
  const layout = useMemo(() => {
    if (images.length === 0) return null;

    // Extract aspect ratios from images
    const aspectRatios = images.map((image) => {
      if (image.width && image.height) {
        return image.width / image.height;
      }
      // Fallback to 4:3 aspect ratio if dimensions missing
      return 4 / 3;
    });

    // Calculate justified layout
    try {
      const geometry = justifiedLayout(aspectRatios, {
        containerWidth: width,
        containerPadding: 0,
        boxSpacing,
        targetRowHeight,
        targetRowHeightTolerance: 0.25, // Allow 25% variance for better fitting
        maxNumRows: Number.POSITIVE_INFINITY, // No limit on rows
        forceAspectRatio: false, // Use actual aspect ratios
        showWidows: true, // Show incomplete last row
        fullWidthBreakoutRowCadence: false, // No special breakout rows
      });

      return geometry;
    } catch (error) {
      console.error('Error calculating justified layout:', error);
      return null;
    }
  }, [images, width, boxSpacing, targetRowHeight]);

  return layout;
}

