import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js Middleware
 * Runs on every request before reaching the page/API route
 *
 * Responsibilities:
 * 1. Refresh auth sessions to keep users logged in
 * 2. Protect admin routes (/admin/*) from unauthenticated access
 * 3. Set cookies properly for Supabase auth
 * 4. Redirect unauthorized users to login page
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if it exists
  // This is important for Server Components to have access to fresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the request is for an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAuthCallback = request.nextUrl.pathname === '/api/auth/callback';

  // Protect admin routes
  if (isAdminRoute && !user) {
    // User is not authenticated, redirect to login
    const redirectUrl = new URL('/login', request.url);
    // Add a redirect parameter to send them back after login
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to admin if user is already logged in and tries to access login page
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // For auth callback, let it through (handled by the callback route)
  // For all other routes, return the response with updated cookies
  return supabaseResponse;
}

/**
 * Middleware Configuration
 * Specifies which routes the middleware should run on
 *
 * We match:
 * - All admin routes (/admin/*)
 * - Login page (/login)
 * - Auth callback (/api/auth/callback)
 *
 * We exclude:
 * - Static files (_next/static/*)
 * - Image optimization (_next/image/*)
 * - Favicon and other public assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

