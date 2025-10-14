'use client';

import { useState, useEffect } from 'react';
import { OptimizedImage } from '@/components/gallery/OptimizedImage';
import { Image } from '@/lib/db/types';
import { getHeroImages } from '@/lib/db/queries';

/**
 * Hero Image Manager Component
 * Admin interface for managing homepage hero slideshow images
 * 
 * Features:
 * - View all current hero images
 * - See hero_display_order
 * - Remove images from hero slideshow
 * - Refresh to see updates
 * 
 * Note: Drag-and-drop reordering will be added in Task 0002.40
 * Note: "Set as Hero" toggle in gallery editor will be added in Task 0002.39
 */

export default function HeroImageManager() {
  const [heroImages, setHeroImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hero images
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

  useEffect(() => {
    fetchHeroImages();
  }, []);

  // Remove image from hero slideshow
  const handleRemoveFromHero = async (imageId: string) => {
    if (!confirm('Remove this image from the hero slideshow?')) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_hero_image: false,
          hero_display_order: null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update image');

      // Refresh the list
      await fetchHeroImages();
    } catch (err) {
      console.error('Error removing hero image:', err);
      alert('Failed to remove image from hero slideshow');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading hero images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-medium mb-2">Error</p>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchHeroImages}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Hero Slideshow Images</h2>
          <p className="text-neutral-600 mt-1">
            Manage images displayed in the homepage hero slideshow
          </p>
        </div>
        <button
          onClick={fetchHeroImages}
          className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Instructions */}
      {heroImages.length === 0 && (
        <div className="bg-sage-50 border border-sage-200 rounded-lg p-6">
          <h3 className="font-medium text-sage-900 mb-2">No Hero Images Yet</h3>
          <p className="text-sage-700 mb-4">
            To add images to the hero slideshow:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sage-700">
            <li>Go to a gallery in the Gallery Manager</li>
            <li>Click "Edit" to open the gallery editor</li>
            <li>Toggle "Set as Hero Image" on any image</li>
            <li>Images will appear here and on the homepage</li>
          </ol>
        </div>
      )}

      {/* Hero Images Grid */}
      {heroImages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-600">
              {heroImages.length} {heroImages.length === 1 ? 'image' : 'images'} in slideshow
            </p>
            <p className="text-xs text-neutral-500">
              Drag-and-drop reordering coming in Task 0002.40
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((image, index) => (
              <div
                key={image.id}
                className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image Preview */}
                <div className="aspect-[16/9] relative bg-neutral-100">
                  <OptimizedImage
                    src={image.url}
                    alt={image.alt_text || 'Hero image'}
                    blurDataUrl={image.blur_data_url}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Image Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-sage-600 bg-sage-50 px-2 py-1 rounded">
                      Order: {image.hero_display_order ?? 'N/A'}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Position {index + 1}
                    </span>
                  </div>

                  {image.alt_text && (
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {image.alt_text}
                    </p>
                  )}

                  <div className="text-xs text-neutral-500">
                    {image.width && image.height && (
                      <span>{image.width} × {image.height}px</span>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleRemoveFromHero(image.id)}
                    className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Remove from Hero
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Hero images appear in the homepage slideshow</li>
          <li>• Images are ordered by their display order number</li>
          <li>• Recommended: 3-5 high-quality images for best effect</li>
          <li>• Use landscape orientation (16:9 ratio) for best results</li>
        </ul>
      </div>
    </div>
  );
}

