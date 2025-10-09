import { CategoryManager } from '@/components/admin/CategoryManager';

/**
 * Admin Categories Page
 * Manage gallery categories
 *
 * Features:
 * - View all categories in sortable list
 * - Create new categories with name and description
 * - Edit existing categories
 * - Delete categories with confirmation (cascade warning)
 * - Drag-and-drop reordering for display_order
 *
 * Protected route - requires admin authentication (handled by middleware)
 */
export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">Manage Categories</h1>
          <p className="text-neutral-600">
            Categories help organize your galleries. You can reorder categories by dragging and dropping
            them into your preferred order.
          </p>
        </div>

        {/* Category Manager Component */}
        <CategoryManager />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Manage Categories | Admin',
  description: 'Manage gallery categories',
};

