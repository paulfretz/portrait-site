import { Metadata } from 'next';
import Link from 'next/link';
import {
  getGalleryCount,
  getCategoryCount,
  getImageCount,
  getNewInquiryCount,
  getRecentGalleries,
} from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'Admin Dashboard | DJ Coveno Portraits',
  description: 'Admin dashboard for managing galleries, categories, and site content.',
};

export default async function AdminDashboard() {
  // Fetch dashboard stats
  const [galleryCount, categoryCount, imageCount, newInquiryCount, recentGalleries] =
    await Promise.all([
      getGalleryCount(),
      getCategoryCount(),
      getImageCount(),
      getNewInquiryCount(),
      getRecentGalleries(),
    ]);
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-serif text-gray-900 mb-6">Admin Dashboard</h2>
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 text-sm font-medium text-sage-700 bg-sage-50 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                href="/admin/galleries"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-neutral-50 rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Galleries
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-neutral-50 rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Categories
              </Link>

              <div className="pt-4 mt-4 border-t border-neutral-200">
                <Link
                  href="/"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-neutral-50 rounded-md transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Site
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Manage your portfolio and site content</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Galleries Card */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Galleries</h3>
                  <svg
                    className="w-8 h-8 text-sage-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-serif text-gray-900 mb-2">{galleryCount}</p>
                <p className="text-xs text-gray-500">
                  {imageCount} total {imageCount === 1 ? 'image' : 'images'}
                </p>
              </div>

              {/* Categories Card */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Categories</h3>
                  <svg
                    className="w-8 h-8 text-sage-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-serif text-gray-900 mb-2">{categoryCount}</p>
                <p className="text-xs text-gray-500">
                  {galleryCount} {galleryCount === 1 ? 'gallery' : 'galleries'} total
                </p>
              </div>

              {/* Inquiries Card */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">New Inquiries</h3>
                  <svg
                    className="w-8 h-8 text-sage-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-serif text-gray-900 mb-2">
                  {newInquiryCount > 0 ? newInquiryCount : '0'}
                </p>
                <p className="text-xs text-gray-500">
                  {newInquiryCount > 0 ? 'Awaiting response' : 'No new inquiries'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
              <h2 className="text-xl font-serif text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/admin/galleries"
                  className="flex items-center justify-center px-4 py-3 bg-sage-50 text-sage-700 rounded-md hover:bg-sage-100 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Gallery
                </Link>

                <Link
                  href="/admin/inquiries"
                  className="flex items-center justify-center px-4 py-3 bg-sage-50 text-sage-700 rounded-md hover:bg-sage-100 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  View Inquiries
                </Link>

                <Link
                  href="/about"
                  className="flex items-center justify-center px-4 py-3 bg-sage-50 text-sage-700 rounded-md hover:bg-sage-100 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit About
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center justify-center px-4 py-3 bg-sage-50 text-sage-700 rounded-md hover:bg-sage-100 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Contact
                </Link>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-serif text-gray-900 mb-4">Recently Updated Galleries</h2>
              {recentGalleries.length > 0 ? (
                <div className="space-y-3">
                  {recentGalleries.map((gallery) => (
                    <Link
                      key={gallery.id}
                      href={`/admin/galleries/${gallery.id}`}
                      className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-md transition-colors group"
                    >
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-sage-700">
                          {gallery.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Updated {new Date(gallery.updated_at).toLocaleDateString()} at{' '}
                          {new Date(gallery.updated_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-neutral-400 group-hover:text-sage-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-neutral-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500">No galleries yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create your first gallery to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

