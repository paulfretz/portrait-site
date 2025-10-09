'use client';

import { useState, useEffect } from 'react';
import type { Category } from '@/lib/db/types';
import { SortableList } from './SortableList';

/**
 * Category Manager Component
 * Admin interface for managing photography categories
 *
 * Features:
 * - List all categories
 * - Create new categories
 * - Edit existing categories
 * - Delete categories with confirmation
 * - Reorder categories (drag-and-drop - implemented in subtask 4.5)
 *
 * Usage:
 * Place in admin categories page (app/admin/categories/page.tsx)
 */
export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create category modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit category modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/categories');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch categories');
      }

      setCategories(result.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Handle category creation
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createName.trim()) {
      setCreateError('Category name is required');
      return;
    }

    try {
      setCreateLoading(true);
      setCreateError(null);

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createName.trim(),
          description: createDescription.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create category');
      }

      // Success - refresh categories list
      await fetchCategories();

      // Close modal and reset form
      setShowCreateModal(false);
      setCreateName('');
      setCreateDescription('');
    } catch (err) {
      console.error('Error creating category:', err);
      setCreateError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setCreateLoading(false);
    }
  };

  // Close modal and reset form
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateName('');
    setCreateDescription('');
    setCreateError(null);
  };

  // Open edit modal with category data
  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setEditError(null);
    setShowEditModal(true);
  };

  // Handle category update
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory) return;

    if (!editName.trim()) {
      setEditError('Category name is required');
      return;
    }

    try {
      setEditLoading(true);
      setEditError(null);

      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update category');
      }

      // Success - refresh categories list
      await fetchCategories();

      // Close modal and reset
      closeEditModal();
    } catch (err) {
      console.error('Error updating category:', err);
      setEditError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setEditLoading(false);
    }
  };

  // Close edit modal and reset
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    setEditName('');
    setEditDescription('');
    setEditError(null);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const response = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete category');
      }

      // Success - refresh categories list
      await fetchCategories();

      // Close modal and reset
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting category:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Close delete modal and reset
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingCategory(null);
    setDeleteError(null);
  };

  // Handle category reordering
  const handleReorder = async (newOrder: Category[]) => {
    // Optimistically update UI
    setCategories(newOrder);

    try {
      // Update display_order for each category based on new position
      const updates = newOrder.map((category, index) =>
        fetch(`/api/categories/${category.id}`, {
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
      await fetchCategories();
    } catch (err) {
      console.error('Error reordering categories:', err);
      // Revert to original order on error
      await fetchCategories();
      setError('Failed to save new category order');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neutral-600">Loading categories...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchCategories}
          className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
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
        <h2 className="text-2xl font-light text-neutral-900">Categories</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
        >
          + New Category
        </button>
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-light text-neutral-900 mb-4">Create New Category</h3>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              {/* Name field */}
              <div>
                <label htmlFor="create-name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-name"
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g., Weddings, Portraits"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              {/* Description field */}
              <div>
                <label
                  htmlFor="create-description"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="create-description"
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Optional description for this category"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Error message */}
              {createError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{createError}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={createLoading}
                  className="px-4 py-2 text-neutral-700 hover:text-neutral-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading || !createName.trim()}
                  className="px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-light text-neutral-900 mb-4">Edit Category</h3>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              {/* Name field */}
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g., Weddings, Portraits"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              {/* Description field */}
              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Optional description for this category"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Error message */}
              {editError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{editError}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={editLoading}
                  className="px-4 py-2 text-neutral-700 hover:text-neutral-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading || !editName.trim()}
                  className="px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-light text-neutral-900 mb-4">Delete Category</h3>

            <div className="space-y-4">
              {/* Warning message */}
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800 font-medium mb-2">⚠️ Warning: This action cannot be undone</p>
                <p className="text-sm text-red-700">
                  Deleting this category will also delete:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 mt-1 ml-2">
                  <li>All galleries in this category</li>
                  <li>All images in those galleries</li>
                </ul>
              </div>

              {/* Category name */}
              <p className="text-neutral-700">
                Are you sure you want to delete the category{' '}
                <span className="font-semibold">&quot;{deletingCategory.name}&quot;</span>?
              </p>

              {/* Error message */}
              {deleteError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{deleteError}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-neutral-700 hover:text-neutral-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-neutral-600">No categories yet</p>
          <p className="text-sm text-neutral-500 mt-1">Create your first category to get started</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <SortableList
              items={categories}
              onReorder={handleReorder}
              renderItem={(category) => (
                <div className="p-4 hover:bg-neutral-50 transition-colors flex items-center justify-between border-b border-neutral-200 last:border-b-0 cursor-move">
                  <div className="flex items-center gap-4">
                    {/* Drag handle indicator */}
                    <div className="text-neutral-400 hover:text-neutral-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                    </div>

                    {/* Category info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-neutral-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-neutral-600 mt-1">{category.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                        <span>Slug: {category.slug}</span>
                        <span>Order: {category.display_order}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(category);
                      }}
                      className="px-3 py-1.5 text-sm text-neutral-700 hover:text-sage-600 hover:bg-sage-50 rounded transition-colors"
                    >
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(category);
                      }}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Info message about drag-and-drop */}
          {categories.length > 1 && (
            <p className="text-sm text-neutral-500 text-center">
              💡 Drag and drop categories to reorder them
            </p>
          )}
        </>
      )}
    </div>
  );
}

