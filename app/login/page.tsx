'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

/**
 * Login Page
 * Provides Google OAuth authentication for the site owner
 *
 * Features:
 * - Simple, clean design matching site aesthetic
 * - Google OAuth sign-in button
 * - Redirects to admin dashboard after successful login
 * - Shows loading state during authentication
 * - Automatically redirects if already logged in
 */
export default function LoginPage() {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to admin dashboard if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/admin');
    }
  }, [user, isLoading, router]);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
      setIsSigningIn(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }

  // Don't show login form if already logged in (will redirect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-neutral-600">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Title */}
        <div className="text-center">
          <h1 className="text-4xl font-light text-neutral-900 tracking-wide">
            DJ Coveno Portraits
          </h1>
          <p className="mt-3 text-neutral-600 font-light">Admin Access</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white shadow-sm rounded-lg p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-light text-neutral-800">Sign In</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Sign in with your Google account to manage your portfolio
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-neutral-300 rounded-md shadow-sm bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <span className="text-neutral-700">Signing in...</span>
            ) : (
              <>
                {/* Google Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-neutral-700 font-medium">Continue with Google</span>
              </>
            )}
          </button>

          {/* Info Text */}
          <p className="text-xs text-center text-neutral-500 mt-4">
            Only authorized administrators can sign in
          </p>
        </div>

        {/* Back to Site Link */}
        <div className="text-center">
          <a
            href="/"
            className="text-sm text-sage-600 hover:text-sage-700 font-medium transition-colors"
          >
            ← Back to Site
          </a>
        </div>
      </div>
    </div>
  );
}
