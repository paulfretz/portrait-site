'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import type { Gallery, Image, Category } from '@/lib/db/types';
import { ImageUploader } from './ImageUploader';
import { SortableList } from './SortableList';

/**
 * Gallery Editor Component
 * Comprehensive gallery management interface
 *
 * Features:
 * - View gallery details
 * - Upload new images
 * - Drag-and-drop reorder images
 * - Set cover image
 * - Delete images
 * - Update gallery metadata
 *
 * @component
 */

interface GalleryEditorProps {
  params: Promise<{ id: string }>;
}

export function GalleryEditor({ params }: GalleryEditorProps) {
  const { id: galleryId } = use(params);

  // State
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  // Fetch gallery, images, and categories
  useEffect(() => {
    fetchGalleryData();
    fetchCategories();
  }, [galleryId]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch gallery details (admin endpoint would include client_name)
      const galleryResponse = await fetch(`/api/galleries/${galleryId}`);
      if (!galleryResponse.ok) {
        throw new Error('Failed to fetch gallery');
      }
      const galleryData = await galleryResponse.json();
      setGallery(galleryData);

      // Fetch images for this gallery
      const imagesResponse = await fetch(`/api/galleries/${galleryId}/images`);
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        setImages(imagesData);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Handle image upload complete
  const handleUploadComplete = (uploadedImages: Image[]) => {
    setImages((prev) => [...prev, ...uploadedImages]);
    setShowUploader(false);
  };

  // Handle image reorder
  const handleReorder = async (newOrder: Image[]) => {
    // Optimistically update UI
    setImages(newOrder);

    try {
      // Update display_order for each image
      const updates = newOrder.map((image, index) =>
        fetch(`/api/images/${image.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            display_order: index,
          }),
        })
      );

      await Promise.all(updates);

      // Refresh to get server state
      await fetchGalleryData();
    } catch (err) {
      console.error('Error reordering images:', err);
      // Revert to original order on error
      await fetchGalleryData();
      alert('Failed to save new image order');
    }
  };

  // Set cover image
  const handleSetCoverImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/galleries/${galleryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cover_image_id: imageId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set cover image');
      }

      // Update local state
      setGallery((prev) => (prev ? { ...prev, cover_image_id: imageId } : null));
    } catch (err) {
      console.error('Error setting cover image:', err);
      alert('Failed to set cover image');
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageId));

      // If this was the cover image, clear it
      if (gallery?.cover_image_id === imageId) {
        setGallery((prev) => (prev ? { ...prev, cover_image_id: null } : null));
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    }
  };

  // Get category name
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    return categories.find((cat) => cat.id === categoryId)?.name || 'Unknown';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sage-400 border-r-transparent mb-4"></div>
          <p className="text-neutral-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !gallery) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error || 'Gallery not found'}</p>
        <Link
          href="/admin/galleries"
          className="text-sage-600 hover:text-sage-700 font-medium"
        >
          ← Back to Galleries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/galleries"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Galleries
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-light text-neutral-900 mb-2">{gallery.title}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded">
                {getCategoryName(gallery.category_id)}
              </span>
              {gallery.date && <span>📅 {new Date(gallery.date).toLocaleDateString()}</span>}
              {gallery.location && <span>📍 {gallery.location}</span>}
              <span>🖼️ {images.length} {images.length === 1 ? 'image' : 'images'}</span>
            </div>
            {gallery.description && (
              <p className="text-neutral-700 mt-2">{gallery.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light text-neutral-900">Images</h2>
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
          >
            {showUploader ? 'Hide Uploader' : '+ Upload Images'}
          </button>
        </div>

        {showUploader && (
          <div className="mb-6">
            <ImageUploader
              galleryId={galleryId}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        )}

        {/* Images List */}
        {images.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 rounded-lg">
            <p className="text-neutral-600">No images yet</p>
            <p className="text-sm text-neutral-500 mt-1">Upload your first image to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              💡 Drag and drop images to reorder. Select a cover image below.
            </p>

            <SortableList
              items={images}
              onReorder={handleReorder}
              renderItem={(image) => (
                <div className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-lg hover:border-sage-300 transition-colors cursor-move">
                  {/* Drag handle */}
                  <div className="text-neutral-400 hover:text-neutral-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  </div>

                  {/* Image preview */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt_text || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                    {gallery.cover_image_id === image.id && (
                      <div className="absolute top-1 right-1 bg-sage-500 text-white text-xs px-2 py-0.5 rounded">
                        Cover
                      </div>
                    )}
                  </div>

                  {/* Image info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 truncate">
                      {image.alt_text || 'No alt text'}
                    </p>
                    <p className="text-xs text-neutral-500">Order: {image.display_order}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Set as cover button */}
                    {gallery.cover_image_id !== image.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetCoverImage(image.id);
                        }}
                        className="px-3 py-1.5 text-xs text-sage-600 hover:text-sage-700 hover:bg-sage-50 border border-sage-300 rounded transition-colors"
                      >
                        Set as Cover
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image.id);
                      }}
                      className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

