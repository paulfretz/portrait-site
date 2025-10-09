import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Logout API Route
 * Handles user sign out and session cleanup
 *
 * Usage:
 * - POST request to /api/auth/logout
 * - Can be called from client components via fetch() or server actions
 * - Clears Supabase session and cookies
 * - Redirects to home page
 *
 * @example
 * ```tsx
 * // From client component
 * const handleLogout = async () => {
 *   await fetch('/api/auth/logout', { method: 'POST' });
 *   router.push('/');
 * };
 * ```
 */
export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  try {
    const supabase = await createClient();

    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
    }

    // Successful logout - redirect to home page
    return NextResponse.redirect(`${origin}/`, {
      status: 302,
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
