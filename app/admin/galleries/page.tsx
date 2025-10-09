import { GalleryManager } from '@/components/admin/GalleryManager';

/**
 * Admin Galleries Page
 * Manage all photography galleries
 *
 * Features:
 * - View all galleries in grid layout
 * - Create new galleries with all required fields
 * - Edit existing galleries
 * - Delete galleries with confirmation
 * - Filter galleries by category
 * - Search galleries by title or location
 *
 * Protected route - requires admin authentication (handled by middleware)
 */
export default function AdminGalleriesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">Manage Galleries</h1>
          <p className="text-neutral-600">
            Create and organize your photography galleries. Each gallery belongs to a category and can
            contain multiple images.
          </p>
        </div>

        {/* Gallery Manager Component */}
        <GalleryManager />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Manage Galleries | Admin',
  description: 'Manage photography galleries',
};

