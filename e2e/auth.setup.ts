import { test as setup } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

/**
 * Authentication Setup for E2E Tests
 * 
 * This setup file creates a REAL authenticated session for admin E2E tests.
 * It runs before all browser tests and saves the session state.
 * 
 * How it works:
 * 1. Signs in to Supabase using test admin credentials
 * 2. Extracts the real session tokens from Supabase
 * 3. Sets the session cookies in the browser context
 * 4. Saves the authenticated state to a file
 * 5. All subsequent tests use this authenticated state
 * 
 * Requirements:
 * - NEXT_PUBLIC_SUPABASE_URL in .env.local
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * - TEST_ADMIN_EMAIL in .env.local (must be a real user in Supabase)
 * - TEST_ADMIN_PASSWORD in .env.local (password for the test user)
 */

const authFile = 'playwright/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  // Check if we have required env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const testEmail = process.env.TEST_ADMIN_EMAIL;
  const testPassword = process.env.TEST_ADMIN_PASSWORD;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️  Skipping auth setup: Missing Supabase configuration');
    console.warn('   Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }

  if (!testEmail || !testPassword) {
    console.warn('⚠️  Skipping auth setup: Missing test credentials');
    console.warn('   Required: TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD');
    console.warn('   To set up:');
    console.warn('   1. Create test user in Supabase Dashboard → Authentication → Users');
    console.warn('   2. Add TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to .env.local');
    console.warn('   Admin E2E tests will run in unauthenticated mode');
    return;
  }

  try {
    console.log(`🔐 Signing in as ${testEmail}...`);

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Sign in with real test credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error('❌ Supabase sign-in failed:', error.message);
      console.warn('   Check that:');
      console.warn('   - Test user exists in Supabase');
      console.warn('   - Email is confirmed');
      console.warn('   - Password is correct');
      return;
    }

    if (!data.session) {
      console.error('❌ No session returned from Supabase');
      return;
    }

    console.log('✅ Supabase session created');
    console.log(`   User ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);

    // Navigate to the app to set domain context
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Extract project reference from Supabase URL
    const projectRef = supabaseUrl.split('//')[1].split('.')[0];

    // Set the session cookies that Next.js middleware expects
    // This matches the format used by @supabase/ssr
    const sessionData = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      expires_at: Math.floor(Date.now() / 1000) + data.session.expires_in,
      token_type: data.session.token_type,
      user: data.user,
    };

    // Set cookies (Supabase SSR uses cookies for server-side)
    await page.context().addCookies([
      {
        name: `sb-${projectRef}-auth-token`,
        value: JSON.stringify(sessionData),
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax' as const,
      },
    ]);

    // Set localStorage (Supabase client uses this on client-side)
    await page.evaluate((data) => {
      const projectRef = data.projectRef;
      const storageKey = `sb-${projectRef}-auth-token`;
      localStorage.setItem(storageKey, JSON.stringify(data.session));
    }, {
      projectRef,
      session: sessionData,
    });

    console.log('✅ Session cookies and localStorage set');

    // Verify we can access admin routes
    console.log('🔍 Verifying admin access...');
    await page.goto('/admin');
    await page.waitForTimeout(2000);

    // Check if we're authenticated
    const currentUrl = page.url();
    const isAuthenticated = currentUrl.includes('/admin') && !currentUrl.includes('/login');

    if (isAuthenticated) {
      console.log('✅ Admin access verified!');
      console.log(`   Current URL: ${currentUrl}`);
      
      // Save signed-in state to file for reuse
      await page.context().storageState({ path: authFile });
      
      console.log(`✅ Authenticated state saved to ${authFile}`);
      console.log('✅ All admin E2E tests will now run as authenticated user');
    } else {
      console.error('❌ Admin access verification failed');
      console.error(`   Current URL: ${currentUrl}`);
      console.error('   Expected to stay on /admin, but got redirected to login');
      console.warn('   Possible issues:');
      console.warn('   - Session format mismatch with middleware expectations');
      console.warn('   - Cookie domain/path issues');
      console.warn('   - Supabase session expired or invalid');
    }
  } catch (error) {
    console.error('❌ Auth setup error:', error);
    console.warn('   Admin E2E tests will run in unauthenticated mode');
  }
});
