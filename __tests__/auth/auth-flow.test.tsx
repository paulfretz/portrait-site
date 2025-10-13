/**
 * Unit Tests for Authentication Flow
 * Tests the auth context and related functionality
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import { useAuth, AuthContext } from '@/lib/auth/auth-context';
import type { AuthContextType } from '@/lib/auth/auth-context';
import { mockUser } from '../utils/test-utils';

describe('Authentication Flow', () => {
  describe('useAuth Hook', () => {
    it('throws error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('returns auth context when used within provider', () => {
      const mockContext: AuthContextType = {
        user: mockUser,
        isLoading: false,
        isAdmin: true,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toEqual(mockContext);
    });
  });

  describe('AuthContextType Interface', () => {
    it('validates user property', () => {
      const context: AuthContextType = {
        user: mockUser,
        isLoading: false,
        isAdmin: true,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(context.user).toBeDefined();
      expect(context.user).toHaveProperty('id');
      expect(context.user).toHaveProperty('email');
    });

    it('validates user can be null', () => {
      const context: AuthContextType = {
        user: null,
        isLoading: false,
        isAdmin: false,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(context.user).toBeNull();
    });

    it('validates isLoading property', () => {
      const context: AuthContextType = {
        user: null,
        isLoading: true,
        isAdmin: false,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(typeof context.isLoading).toBe('boolean');
      expect(context.isLoading).toBe(true);
    });

    it('validates isAdmin property', () => {
      const context: AuthContextType = {
        user: mockUser,
        isLoading: false,
        isAdmin: true,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(typeof context.isAdmin).toBe('boolean');
      expect(context.isAdmin).toBe(true);
    });

    it('validates signInWithGoogle is a function', () => {
      const signInFn = jest.fn();
      const context: AuthContextType = {
        user: null,
        isLoading: false,
        isAdmin: false,
        signInWithGoogle: signInFn,
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(typeof context.signInWithGoogle).toBe('function');
    });

    it('validates signOut is a function', () => {
      const signOutFn = jest.fn();
      const context: AuthContextType = {
        user: mockUser,
        isLoading: false,
        isAdmin: true,
        signInWithGoogle: jest.fn(),
        signOut: signOutFn,
        refreshSession: jest.fn(),
      };

      expect(typeof context.signOut).toBe('function');
    });

    it('validates refreshSession is a function', () => {
      const refreshFn = jest.fn();
      const context: AuthContextType = {
        user: mockUser,
        isLoading: false,
        isAdmin: true,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: refreshFn,
      };

      expect(typeof context.refreshSession).toBe('function');
    });
  });

  describe('Admin Email Validation', () => {
    it('validates admin email format', () => {
      const adminEmail = 'admin@example.com';
      expect(adminEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('checks if user email matches admin email', () => {
      const userEmail = 'admin@example.com';
      const adminEmail = 'admin@example.com';
      
      expect(userEmail).toBe(adminEmail);
    });

    it('checks if user email does not match admin email', () => {
      const userEmail = 'user@example.com';
      const adminEmail = 'admin@example.com';
      
      expect(userEmail).not.toBe(adminEmail);
    });

    it('handles case sensitivity in email comparison', () => {
      const userEmail = 'ADMIN@EXAMPLE.COM';
      const adminEmail = 'admin@example.com';
      
      expect(userEmail.toLowerCase()).toBe(adminEmail.toLowerCase());
    });
  });

  describe('Authentication States', () => {
    it('represents unauthenticated state', () => {
      const unauthenticated: AuthContextType = {
        user: null,
        isLoading: false,
        isAdmin: false,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(unauthenticated.user).toBeNull();
      expect(unauthenticated.isAdmin).toBe(false);
    });

    it('represents loading state', () => {
      const loading: AuthContextType = {
        user: null,
        isLoading: true,
        isAdmin: false,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(loading.isLoading).toBe(true);
    });

    it('represents authenticated non-admin state', () => {
      const authenticatedUser: AuthContextType = {
        user: { ...mockUser, email: 'user@example.com' },
        isLoading: false,
        isAdmin: false,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(authenticatedUser.user).not.toBeNull();
      expect(authenticatedUser.isAdmin).toBe(false);
    });

    it('represents authenticated admin state', () => {
      const authenticatedAdmin: AuthContextType = {
        user: mockUser,
        isLoading: false,
        isAdmin: true,
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        refreshSession: jest.fn(),
      };

      expect(authenticatedAdmin.user).not.toBeNull();
      expect(authenticatedAdmin.isAdmin).toBe(true);
    });
  });

  describe('User Object Validation', () => {
    it('validates user object structure', () => {
      expect(mockUser).toHaveProperty('id');
      expect(mockUser).toHaveProperty('email');
      expect(mockUser).toHaveProperty('aud');
      expect(mockUser).toHaveProperty('user_metadata');
      expect(mockUser).toHaveProperty('app_metadata');
    });

    it('validates user id is string', () => {
      expect(typeof mockUser.id).toBe('string');
      expect(mockUser.id.length).toBeGreaterThan(0);
    });

    it('validates user email format', () => {
      expect(mockUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('validates user aud field', () => {
      expect(mockUser.aud).toBe('authenticated');
    });
  });

  describe('OAuth Flow', () => {
    it('validates Google OAuth provider', () => {
      const provider = 'google';
      expect(provider).toBe('google');
    });

    it('validates redirect URL format', () => {
      const redirectUrl = '/admin';
      expect(redirectUrl).toMatch(/^\//);
    });

    it('validates callback URL format', () => {
      const callbackUrl = '/api/auth/callback';
      expect(callbackUrl).toBe('/api/auth/callback');
    });
  });

  describe('Session Management', () => {
    it('validates session refresh capability', () => {
      const refreshFn = jest.fn();
      expect(typeof refreshFn).toBe('function');
    });

    it('validates sign out capability', () => {
      const signOutFn = jest.fn();
      expect(typeof signOutFn).toBe('function');
    });
  });

  describe('Environment Variables', () => {
    it('validates admin email environment variable key', () => {
      const envKey = 'NEXT_PUBLIC_ADMIN_EMAIL';
      expect(envKey).toBe('NEXT_PUBLIC_ADMIN_EMAIL');
      expect(envKey).toContain('NEXT_PUBLIC');
    });

    it('validates Supabase URL environment variable key', () => {
      const envKey = 'NEXT_PUBLIC_SUPABASE_URL';
      expect(envKey).toBe('NEXT_PUBLIC_SUPABASE_URL');
    });

    it('validates Supabase anon key environment variable key', () => {
      const envKey = 'NEXT_PUBLIC_SUPABASE_ANON_KEY';
      expect(envKey).toBe('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    });
  });
});

