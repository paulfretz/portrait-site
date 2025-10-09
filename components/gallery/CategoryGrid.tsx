'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/db/types';

/**
 * Category Grid Component
 * Displays all photography categories in a responsive grid
 *
 * Features:
 * - Fetches categories from API
 * - Shows category cover images
 * - Displays gallery counts
 * - Responsive grid layout
 * - Loading and error states
 * - Hover effects and transitions
 *
 * @component
 */
export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      setCategories(data.data || data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-neutral-100 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-neutral-200"></div>
            <div className="p-6">
              <div className="h-6 bg-neutral-200 rounded mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-medium">Unable to load galleries</p>
          <p className="text-sm text-neutral-600 mt-2">{error}</p>
        </div>
        <button
          onClick={fetchCategories}
          className="px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium text-neutral-600">No galleries available</p>
          <p className="text-sm text-neutral-500 mt-2">Check back soon for new photography galleries.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/galleries/${category.slug}`}
          className="group block bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md hover:border-sage-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
        >
          {/* Category Cover Image */}
          <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage-50 to-neutral-100">
              <div className="text-center">
                <svg className="w-16 h-16 text-sage-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-sage-600 font-medium">{category.name}</p>
              </div>
            </div>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Category Info */}
          <div className="p-6">
            <h2 className="text-xl font-light text-neutral-900 mb-2 group-hover:text-sage-600 transition-colors duration-200">
              {category.name}
            </h2>
            
            {category.description && (
              <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>
            )}

            <div className="flex items-center justify-end">
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-sage-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
