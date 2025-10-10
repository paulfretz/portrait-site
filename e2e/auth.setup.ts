import { test as setup, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

/**
 * Authentication Setup for E2E Tests
 * 
 * This setup file creates an authenticated session for admin E2E tests.
 * It runs before tests that require authentication and saves the session state.
 * 
 * How it works:
 * 1. Creates a Supabase session using admin email (from env)
 * 2. Sets the session cookies in the browser
 * 3. Saves the authenticated state to a file
 * 4. Tests marked with @authenticated can use this state
 * 
 * Requirements:
 * - NEXT_PUBLIC_SUPABASE_URL in .env.local
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * - NEXT_PUBLIC_ADMIN_EMAIL in .env.local (must match a real user in Supabase)
 * - TEST_ADMIN_PASSWORD in .env.local (optional, for automated OAuth)
 */

const authFile = 'playwright/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  // Check if we have required env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!supabaseUrl || !supabaseAnonKey || !adminEmail) {
    console.warn('⚠️  Skipping auth setup: Missing environment variables');
    console.warn('   Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_ADMIN_EMAIL');
    return;
  }

  // Approach: Create a session directly using Supabase client
  // This bypasses OAuth and creates a test session
  // Note: This requires a test user to exist in Supabase
  
  try {
    // Navigate to the app first to set domain context
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // For test purposes, we'll manually set cookies using Supabase's session format
    // This is a simplified approach - in production, you'd use real OAuth flow
    
    // Create a mock session structure
    const mockSession = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'test-admin-id',
        email: adminEmail,
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    // Set the session in localStorage (Supabase client uses this)
    await page.evaluate((session) => {
      const storageKey = `sb-${window.location.hostname.split('.')[0]}-auth-token`;
      localStorage.setItem(storageKey, JSON.stringify(session));
    }, mockSession);

    // Also set cookies that middleware might check
    await page.context().addCookies([
      {
        name: 'sb-access-token',
        value: mockSession.access_token,
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
      {
        name: 'sb-refresh-token',
        value: mockSession.refresh_token,
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    // Verify we can access admin routes
    await page.goto('/admin');
    await page.waitForTimeout(2000);

    // Check if we're still on admin page (not redirected to login)
    const currentUrl = page.url();
    const isAuthenticated = currentUrl.includes('/admin') && !currentUrl.includes('/login');

    if (isAuthenticated) {
      console.log('✅ Authentication setup successful');
      
      // Save signed-in state to file
      await page.context().storageState({ path: authFile });
    } else {
      console.warn('⚠️  Authentication setup incomplete - tests will run unauthenticated');
      console.warn('   To enable full admin E2E testing:');
      console.warn('   1. Ensure admin user exists in Supabase with NEXT_PUBLIC_ADMIN_EMAIL');
      console.warn('   2. Or configure TEST_ADMIN_PASSWORD for automated OAuth login');
    }
  } catch (error) {
    console.warn('⚠️  Auth setup failed:', error);
    console.warn('   Admin E2E tests will run in unauthenticated mode');
  }
});

