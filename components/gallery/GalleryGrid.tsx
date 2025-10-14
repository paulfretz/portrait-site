'use client';

import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import { GalleryPublic } from '@/lib/db/types';
import { getCoverImageUrl } from '@/lib/utils/image-urls';

interface GalleryGridProps {
  galleries: (GalleryPublic & { category_slug: string; cover_image_url?: string | null })[];
}

export function GalleryGrid({ galleries }: GalleryGridProps) {
  if (!galleries || galleries.length === 0) {
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
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Galleries Found
          </h3>
          <p className="text-gray-600">
            There are no galleries available at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {galleries.map((gallery) => (
        <Link
          key={gallery.id}
          href={`/galleries/${gallery.category_slug}/${gallery.slug}`}
          className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          {/* Cover Image */}
          <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
            {gallery.cover_image_url ? (
              <OptimizedImage
                src={getCoverImageUrl(gallery.cover_image_url) || gallery.cover_image_url}
                alt={gallery.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-50 to-sage-100">
                <svg
                  className="w-16 h-16 text-sage-400"
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
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Gallery Info */}
          <div className="p-6">
            <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-sage-700 transition-colors duration-300">
              {gallery.title}
            </h3>
            
            {gallery.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {gallery.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              {gallery.date && (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(gallery.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              
              {gallery.location && (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {gallery.location}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
