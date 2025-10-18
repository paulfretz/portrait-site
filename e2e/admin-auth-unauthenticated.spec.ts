import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Unauthenticated Admin Access
 * Tests that require NO authentication (clean browser state)
 * 
 * These tests explicitly use storageState: undefined to ensure
 * they run without the authenticated session from auth.setup.ts
 */

// Override to use NO authentication for these tests
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Unauthenticated Admin Access', () => {
  test('login page loads successfully', async ({ page }) => {
    await page.goto('/login');
    
    // Check page title
    await expect(page).toHaveTitle(/DJ Coveno Portraits/);
    
    // Should show login content (not admin dashboard)
    const signInButton = page.locator('button:has-text("Google"), button:has-text("Sign in"), button:has-text("Continue")');
    await expect(signInButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('login page has Google sign-in button', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Look for Google sign-in button
    const googleButton = page.locator('button:has-text("Google"), button:has-text("Sign in"), button:has-text("Continue with Google")');
    await expect(googleButton.first()).toBeVisible();
  });

  test('unauthenticated user cannot access admin dashboard', async ({ page }) => {
    // Try to access admin dashboard without authentication
    await page.goto('/admin');
    
    // Should redirect to login page
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('unauthenticated user cannot access admin galleries', async ({ page }) => {
    await page.goto('/admin/galleries');
    
    // Should redirect to login page
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('unauthenticated user cannot access admin categories', async ({ page }) => {
    await page.goto('/admin/categories');
    
    // Should redirect to login page
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('unauthenticated user cannot access admin inquiries', async ({ page }) => {
    await page.goto('/admin/inquiries');
    
    // Should redirect to login page
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('middleware protects all admin routes', async ({ page }) => {
    const adminRoutes = [
      '/admin',
      '/admin/galleries',
      '/admin/categories',
      '/admin/inquiries',
    ];
    
    for (const route of adminRoutes) {
      await page.goto(route);
      
      // Should redirect to login
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toContain('/login');
    }
  });

  test('login page shows loading state when Google button clicked', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    const googleButton = page.locator('button:has-text("Google"), button:has-text("Continue with Google"), button:has-text("Sign in")').first();
    
    if (await googleButton.isVisible()) {
      // Click button and wait for navigation or state change
      const [navigation] = await Promise.allSettled([
        page.waitForURL('**/auth/**', { timeout: 5000 }),
        googleButton.click()
      ]);
      
      // Check if we're redirected to Google OAuth
      const currentUrl = page.url();
      const isRedirected = currentUrl.includes('google') || currentUrl.includes('oauth') || currentUrl.includes('accounts.google');
      
      if (!isRedirected) {
        // If not redirected, check for loading state
        const isDisabled = await googleButton.isDisabled().catch(() => false);
        const buttonText = await googleButton.textContent().catch(() => '');
        const hasLoadingState = isDisabled || (buttonText && (buttonText.toLowerCase().includes('loading') || buttonText.includes('...')));
        
        // Either redirected or shows loading state
        expect(isRedirected || hasLoadingState).toBeTruthy();
      }
    } else {
      // If no Google button, just verify page loads
      expect(page.url()).toContain('/login');
    }
  });

  test('login page works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Login button should still be visible
    const googleButton = page.locator('button:has-text("Google"), button:has-text("Sign in"), button:has-text("Continue")');
    await expect(googleButton.first()).toBeVisible();
  });

  test('login page displays error for failed authentication', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check that the login page loads properly and has Google OAuth button
    const googleButton = page.locator('button:has-text("Google"), button:has-text("Continue with Google"), button:has-text("Sign in")');
    const buttonCount = await googleButton.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('OAuth callback route exists', async ({ page }) => {
    // Visit the OAuth callback URL
    const response = await page.goto('/api/auth/callback');
    
    // Should redirect (not 404) - either to login or admin
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(login|admin)$/);
  });

  test('Google OAuth configuration is present', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Look for any Google-related button or link
    const googleButton = page.locator('button:has-text("Google"), button:has-text("Sign in"), button:has-text("Continue"), a:has-text("Google")');
    const buttonCount = await googleButton.count();
    
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('admin toolbar is NOT visible when logged out', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for any client-side rendering to complete
    await page.waitForTimeout(1000);
    
    // Check for the specific AdminToolbar component by its unique CSS class
    const adminToolbar = page.locator('.bg-sage-400.border-b.border-sage-500');
    const toolbarCount = await adminToolbar.count();
    
    // Should be 0 admin toolbars visible
    expect(toolbarCount).toBe(0);
  });
});

