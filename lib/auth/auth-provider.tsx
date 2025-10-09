'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { AuthContext, type AuthContextType } from './auth-context';

/**
 * Authentication Provider Component
 * Wraps the application and provides authentication state to all child components
 *
 * This component:
 * - Manages user authentication state
 * - Listens for auth state changes from Supabase
 * - Provides sign in/out methods
 * - Checks if user is admin based on ADMIN_EMAIL environment variable
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { AuthProvider } from '@/lib/auth/auth-provider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Check if the current user is an admin
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  /**
   * Sign in with Google OAuth
   * Redirects to Google OAuth consent screen
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
        throw error;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }, [supabase]);

  /**
   * Sign out the current user
   * Clears session and redirects to home page
   */
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error.message);
        throw error;
      }

      // Redirect to home page after sign out
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router]);

  /**
   * Refresh the current session
   * Useful for updating user data or checking auth status
   */
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Error refreshing session:', error.message);
        throw error;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  }, [supabase]);

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes (sign in, sign out, token refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Refresh the router to update server components
      router.refresh();
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAdmin,
    signInWithGoogle,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
