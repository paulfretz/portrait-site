'use client';

import { useState, useEffect } from 'react';
import type { GalleryPublic, Category } from '@/lib/db/types';

/**
 * Gallery Manager Component
 * Admin interface for managing photography galleries
 *
 * Features:
 * - List all galleries with cover images
 * - View gallery details (title, description, date, location, category)
 * - Create new galleries with category assignment
 * - Edit existing galleries
 * - Delete galleries with confirmation
 * - Filter galleries by category
 * - Search galleries by title or location
 *
 * Note: Client names are not displayed (privacy protection)
 *
 * @component
 */
export function GalleryManager() {
  // Gallery list state
  const [galleries, setGalleries] = useState<GalleryPublic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createLocation, setCreateLocation] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [createClientName, setCreateClientName] = useState('');
  const [createCategoryId, setCreateCategoryId] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryPublic | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingGallery, setDeletingGallery] = useState<GalleryPublic | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch galleries and categories
  useEffect(() => {
    fetchGalleries();
    fetchCategories();
  }, [selectedCategoryId]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      if (selectedCategoryId) {
        params.append('category_id', selectedCategoryId);
      }

      const response = await fetch(`/api/galleries?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch galleries: ${response.statusText}`);
      }

      const data = await response.json();
      setGalleries(data);
    } catch (err) {
      console.error('Error fetching galleries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Filter galleries by search query (client-side)
  const filteredGalleries = galleries.filter((gallery) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      gallery.title.toLowerCase().includes(query) ||
      gallery.location?.toLowerCase().includes(query) ||
      gallery.description?.toLowerCase().includes(query)
    );
  });

  // Helper to get category name
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    return categories.find((cat) => cat.id === categoryId)?.name || 'Unknown';
  };

  // Create gallery handler
  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createTitle.trim()) {
      setCreateError('Title is required');
      return;
    }

    if (!createCategoryId) {
      setCreateError('Please select a category');
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      const response = await fetch('/api/galleries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: createTitle.trim(),
          description: createDescription.trim() || null,
          location: createLocation.trim() || null,
          date: createDate || null,
          client_name: createClientName.trim() || null,
          category_id: createCategoryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create gallery');
      }

      // Success - refresh and close
      await fetchGalleries();
      closeCreateModal();
    } catch (err) {
      console.error('Error creating gallery:', err);
      setCreateError(err instanceof Error ? err.message : 'Failed to create gallery');
    } finally {
      setCreateLoading(false);
    }
  };

  // Close create modal and reset form
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateTitle('');
    setCreateDescription('');
    setCreateLocation('');
    setCreateDate('');
    setCreateClientName('');
    setCreateCategoryId(null);
    setCreateError(null);
  };

  // Open edit modal with gallery data
  const handleEditClick = (gallery: GalleryPublic) => {
    setEditingGallery(gallery);
    setEditTitle(gallery.title);
    setEditDescription(gallery.description || '');
    setEditLocation(gallery.location || '');
    setEditDate(gallery.date || '');
    // Note: client_name is not in GalleryPublic, so we'll need to fetch it or leave it empty
    setEditClientName(''); // Will need to fetch full gallery data to get client_name
    setEditCategoryId(gallery.category_id);
    setShowEditModal(true);
  };

  // Edit gallery handler
  const handleEditGallery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingGallery) return;

    if (!editTitle.trim()) {
      setEditError('Title is required');
      return;
    }

    if (!editCategoryId) {
      setEditError('Please select a category');
      return;
    }

    setEditLoading(true);
    setEditError(null);

    try {
      const response = await fetch(`/api/galleries/${editingGallery.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim() || null,
          location: editLocation.trim() || null,
          date: editDate || null,
          client_name: editClientName.trim() || null,
          category_id: editCategoryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update gallery');
      }

      // Success - refresh and close
      await fetchGalleries();
      closeEditModal();
    } catch (err) {
      console.error('Error updating gallery:', err);
      setEditError(err instanceof Error ? err.message : 'Failed to update gallery');
    } finally {
      setEditLoading(false);
    }
  };

  // Close edit modal and reset form
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingGallery(null);
    setEditTitle('');
    setEditDescription('');
    setEditLocation('');
    setEditDate('');
    setEditClientName('');
    setEditCategoryId(null);
    setEditError(null);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (gallery: GalleryPublic) => {
    setDeletingGallery(gallery);
    setShowDeleteModal(true);
  };

  // Delete gallery handler
  const handleDeleteGallery = async () => {
    if (!deletingGallery) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/galleries/${deletingGallery.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete gallery');
      }

      // Success - refresh and close
      await fetchGalleries();
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting gallery:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete gallery');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Close delete modal and reset
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingGallery(null);
    setDeleteError(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sage-400 border-r-transparent mb-4"></div>
          <p className="text-neutral-600">Loading galleries...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">Error: {error}</p>
        <button
          onClick={fetchGalleries}
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
        <h2 className="text-2xl font-light text-neutral-900">Galleries</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2"
        >
          + New Gallery
        </button>
      </div>

      {/* Create Gallery Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-light text-neutral-900 mb-4">Create New Gallery</h3>

            <form onSubmit={handleCreateGallery} className="space-y-4">
              {/* Title field */}
              <div>
                <label htmlFor="create-title" className="block text-sm font-medium text-neutral-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="create-title"
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="e.g., Smith Family Portraits"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              {/* Category selection */}
              <div>
                <label htmlFor="create-category" className="block text-sm font-medium text-neutral-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="create-category"
                  value={createCategoryId || ''}
                  onChange={(e) => setCreateCategoryId(e.target.value || null)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description field */}
              <div>
                <label htmlFor="create-description" className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  id="create-description"
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Optional description for this gallery"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Location field */}
              <div>
                <label htmlFor="create-location" className="block text-sm font-medium text-neutral-700 mb-1">
                  Location
                </label>
                <input
                  id="create-location"
                  type="text"
                  value={createLocation}
                  onChange={(e) => setCreateLocation(e.target.value)}
                  placeholder="e.g., Missoula, MT"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                />
              </div>

              {/* Date field */}
              <div>
                <label htmlFor="create-date" className="block text-sm font-medium text-neutral-700 mb-1">
                  Date
                </label>
                <input
                  id="create-date"
                  type="date"
                  value={createDate}
                  onChange={(e) => setCreateDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                />
              </div>

              {/* Client name field */}
              <div>
                <label htmlFor="create-client-name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Client Name
                  <span className="ml-2 text-xs text-neutral-500">(Private - not shown to public)</span>
                </label>
                <input
                  id="create-client-name"
                  type="text"
                  value={createClientName}
                  onChange={(e) => setCreateClientName(e.target.value)}
                  placeholder="Optional client name for internal reference"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
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
                  disabled={createLoading || !createTitle.trim() || !createCategoryId}
                  className="px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading ? 'Creating...' : 'Create Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Gallery Modal */}
      {showEditModal && editingGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-light text-neutral-900 mb-4">Edit Gallery</h3>

            <form onSubmit={handleEditGallery} className="space-y-4">
              {/* Title field */}
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-neutral-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g., Smith Family Portraits"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              {/* Category selection */}
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-neutral-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-category"
                  value={editCategoryId || ''}
                  onChange={(e) => setEditCategoryId(e.target.value || null)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description field */}
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Optional description for this gallery"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Location field */}
              <div>
                <label htmlFor="edit-location" className="block text-sm font-medium text-neutral-700 mb-1">
                  Location
                </label>
                <input
                  id="edit-location"
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g., Missoula, MT"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                />
              </div>

              {/* Date field */}
              <div>
                <label htmlFor="edit-date" className="block text-sm font-medium text-neutral-700 mb-1">
                  Date
                </label>
                <input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                />
              </div>

              {/* Client name field */}
              <div>
                <label htmlFor="edit-client-name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Client Name
                  <span className="ml-2 text-xs text-neutral-500">(Private - not shown to public)</span>
                </label>
                <input
                  id="edit-client-name"
                  type="text"
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  placeholder="Optional client name for internal reference"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Note: Client name is not loaded from public API - leave blank to keep existing value
                </p>
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
                  disabled={editLoading || !editTitle.trim() || !editCategoryId}
                  className="px-4 py-2 bg-sage-400 text-white rounded-md hover:bg-sage-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? 'Updating...' : 'Update Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Gallery Confirmation Modal */}
      {showDeleteModal && deletingGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-light text-neutral-900 mb-4">Delete Gallery</h3>

            <div className="space-y-4">
              <p className="text-neutral-700">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{deletingGallery.title}</span>?
              </p>

              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800 font-medium mb-1">⚠️ Warning</p>
                <p className="text-sm text-red-700">
                  This will permanently delete the gallery and all associated images. This action cannot be
                  undone.
                </p>
              </div>

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
                  onClick={handleDeleteGallery}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Gallery'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category filter */}
        <div className="flex-1">
          <label htmlFor="category-filter" className="block text-sm font-medium text-neutral-700 mb-1">
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={selectedCategoryId || ''}
            onChange={(e) => setSelectedCategoryId(e.target.value || null)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search filter */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or location..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Gallery List */}
      {filteredGalleries.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
          {searchQuery || selectedCategoryId ? (
            <>
              <p className="text-neutral-600">No galleries match your filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryId(null);
                }}
                className="mt-2 text-sm text-sage-600 hover:text-sage-700 font-medium"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <p className="text-neutral-600">No galleries yet</p>
              <p className="text-sm text-neutral-500 mt-1">Create your first gallery to get started</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Cover Image */}
              <div className="aspect-[4/3] bg-neutral-100 relative">
                {gallery.cover_image_id ? (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    {/* TODO: Task 5.10 - Display actual cover image */}
                    <span className="text-sm">Cover Image: {gallery.cover_image_id}</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <span className="text-sm">No cover image</span>
                  </div>
                )}
              </div>

              {/* Gallery Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-neutral-900 flex-1">{gallery.title}</h3>
                  <span className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded">
                    {getCategoryName(gallery.category_id)}
                  </span>
                </div>

                {gallery.description && (
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{gallery.description}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                  {gallery.date && (
                    <span>📅 {new Date(gallery.date).toLocaleDateString()}</span>
                  )}
                  {gallery.location && <span>📍 {gallery.location}</span>}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(gallery)}
                    className="flex-1 px-3 py-1.5 text-sm text-neutral-700 hover:text-sage-600 hover:bg-sage-50 border border-neutral-300 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(gallery)}
                    className="flex-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery count */}
      {filteredGalleries.length > 0 && (
        <p className="text-sm text-neutral-500 text-center">
          Showing {filteredGalleries.length} of {galleries.length} {galleries.length === 1 ? 'gallery' : 'galleries'}
        </p>
      )}
    </div>
  );
}

