import { Suspense } from 'react';
import { CategoryGrid } from '@/components/gallery/CategoryGrid';

/**
 * Galleries Overview Page
 * Shows all photography categories in a grid layout
 *
 * Features:
 * - Displays all categories with cover images
 * - Category descriptions and gallery counts
 * - Responsive grid layout
 * - Loading states and error handling
 * - SEO optimized with proper meta tags
 *
 * @component
 */
export default function GalleriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-neutral-900 mb-4">
              Photography Galleries
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Explore our collection of portrait photography across different categories. 
              Each gallery showcases our work in weddings, engagements, families, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for category grid
 */
function CategoryGridSkeleton() {
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

export const metadata = {
  title: 'Photography Galleries | DJ Coveno Portraits',
  description: 'Explore our portrait photography galleries including weddings, engagements, families, seniors, pets, and proposals in Montana.',
  keywords: 'photography galleries, wedding photography, engagement photos, family portraits, Montana photographer, Bozeman photographer, Big Sky photographer',
  openGraph: {
    title: 'Photography Galleries | DJ Coveno Portraits',
    description: 'Explore our portrait photography galleries including weddings, engagements, families, seniors, pets, and proposals in Montana.',
    type: 'website',
  },
};
