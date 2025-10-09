'use client';

import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * Authentication context type definition
 * Provides user state and authentication methods throughout the application
 */
export interface AuthContextType {
  /**
   * Current authenticated user, or null if not logged in
   */
  user: User | null;

  /**
   * Loading state for authentication operations
   * True during initial auth check or sign in/out operations
   */
  isLoading: boolean;

  /**
   * Whether the current user is an admin
   * Checks if user email matches ADMIN_EMAIL from environment
   */
  isAdmin: boolean;

  /**
   * Sign in with Google OAuth
   * Redirects to Google OAuth consent screen
   */
  signInWithGoogle: () => Promise<void>;

  /**
   * Sign out the current user
   * Clears session and redirects to home page
   */
  signOut: () => Promise<void>;

  /**
   * Refresh the current session
   * Useful for updating user data or checking auth status
   */
  refreshSession: () => Promise<void>;
}

/**
 * Authentication context
 * Use this context via the useAuth hook, not directly
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access authentication context
 * Must be used within an AuthProvider
 *
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * 'use client';
 * import { useAuth } from '@/lib/auth/auth-context';
 *
 * export default function MyComponent() {
 *   const { user, isAdmin, signInWithGoogle, signOut } = useAuth();
 *
 *   if (!user) {
 *     return <button onClick={signInWithGoogle}>Sign In</button>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user.email}</p>
 *       {isAdmin && <p>You are an admin!</p>}
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
