import { GalleryEditor } from '@/components/admin/GalleryEditor';

/**
 * Gallery Editor Page
 * Edit gallery details, upload images, reorder photos, and set cover image
 *
 * Features:
 * - Edit gallery metadata (title, description, location, date, category)
 * - Upload new images with drag-and-drop
 * - Drag-and-drop to reorder existing images
 * - Select cover image
 * - Delete images
 * - View image count and gallery info
 *
 * Protected route - requires admin authentication (handled by middleware)
 */
export default async function GalleryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Editor Component */}
        <GalleryEditor galleryId={id} />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Edit Gallery | Admin',
  description: 'Edit gallery and manage images',
};

