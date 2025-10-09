'use client';

import { useAuth } from '@/lib/auth/auth-context';
import Link from 'next/link';

/**
 * Admin Toolbar Component
 * Small persistent toolbar shown at the top of all pages when user is logged in
 *
 * Features:
 * - Displays admin status and user email
 * - Link to admin dashboard
 * - Logout button
 * - Minimal design matching site aesthetic
 * - Only visible when authenticated
 *
 * Usage:
 * Add this component to the main layout (app/layout.tsx) inside AuthProvider
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <AdminToolbar />
 *   {children}
 * </AuthProvider>
 * ```
 */
export function AdminToolbar() {
  const { user, isAdmin, signOut } = useAuth();

  // Don't render if not logged in
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-sage-400 border-b border-sage-500 shadow-sm">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left side - Admin indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* Admin badge */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-sage-700">
                {isAdmin ? 'Admin' : 'Logged In'}
              </span>
              {/* User email */}
              <span className="text-sm text-white font-light hidden sm:inline">{user.email}</span>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Dashboard link */}
            <Link
              href="/admin"
              className="text-sm text-white hover:text-sage-100 font-medium transition-colors"
            >
              Dashboard
            </Link>

            {/* Divider */}
            <span className="text-sage-300">|</span>

            {/* Logout button */}
            <button
              onClick={handleSignOut}
              className="text-sm text-white hover:text-sage-100 font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
