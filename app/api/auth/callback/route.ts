import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * OAuth Callback Handler
 * Handles the callback from Google OAuth after user signs in
 *
 * Flow:
 * 1. User clicks "Sign in with Google" on /login page
 * 2. Redirected to Google OAuth consent screen
 * 3. User approves access
 * 4. Google redirects back to this route with an auth code
 * 5. This route exchanges the code for a session
 * 6. User is redirected to the admin dashboard
 *
 * @see https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error.message);
      // Redirect to login page with error
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Successful authentication - redirect to admin dashboard
    return NextResponse.redirect(`${origin}/admin`);
  }

  // No code provided - redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
