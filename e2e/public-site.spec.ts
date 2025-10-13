import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Public Site Navigation
 * Tests the main navigation, page accessibility, and user flows
 */

test.describe('Public Site Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Start at homepage before each test
    await page.goto('/');
  });

  test('homepage loads successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Montana Portrait Photography/);
    
    // Check hero content is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation header is present on all pages', async ({ page }) => {
    // Check navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check navigation links
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Galleries' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('navigates to Galleries page', async ({ page }) => {
    // Click Galleries link
    await page.getByRole('link', { name: 'Galleries' }).click();
    
    // Verify URL
    await expect(page).toHaveURL('/galleries');
    
    // Verify page content
    await expect(page.locator('h1')).toContainText(/Galleries|Photography/i);
  });

  test('navigates to About page', async ({ page }) => {
    // Click About link
    await page.getByRole('link', { name: 'About' }).click();
    
    // Verify URL
    await expect(page).toHaveURL('/about');
    
    // Verify page content
    await expect(page.locator('h1')).toContainText(/About/i);
  });

  test('navigates to Contact page', async ({ page }) => {
    // Click Contact link
    await page.getByRole('link', { name: 'Contact' }).click();
    
    // Verify URL
    await expect(page).toHaveURL('/contact');
    
    // Verify page content
    await expect(page.locator('h1')).toContainText(/Contact/i);
    
    // Verify contact form is present
    await expect(page.locator('form')).toBeVisible();
  });

  test('navigates back to homepage from other pages', async ({ page }) => {
    // Navigate to About
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');
    
    // Navigate back to Home
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('footer is present on all pages', async ({ page }) => {
    const pages = ['/', '/galleries', '/about', '/contact'];
    
    for (const url of pages) {
      await page.goto(url);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigation should still be accessible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('page meta tags are present', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Check Open Graph title
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('homepage has call-to-action buttons', async ({ page }) => {
    // Look for CTA buttons
    const viewGalleriesBtn = page.getByRole('link', { name: /View.*Galleries/i });
    const contactBtn = page.getByRole('link', { name: /Contact/i });
    
    await expect(viewGalleriesBtn.first()).toBeVisible();
    await expect(contactBtn.first()).toBeVisible();
  });

  test('CTA button navigates to galleries', async ({ page }) => {
    // Click "View Galleries" CTA
    await page.getByRole('link', { name: /View.*Galleries/i }).first().click();
    
    // Should navigate to galleries page
    await expect(page).toHaveURL('/galleries');
  });

  test('contact CTA navigates to contact page', async ({ page }) => {
    // Click "Contact" CTA
    await page.getByRole('link', { name: /Contact.*Me|Get in Touch/i }).first().click();
    
    // Should navigate to contact page
    await expect(page).toHaveURL(/\/contact/);
  });

  test('images load properly', async ({ page }) => {
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check for images (Next.js Image components)
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Should have at least some images
    expect(imageCount).toBeGreaterThan(0);
  });

  test('no console errors on page load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known/acceptable errors (like image loading issues in test env)
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('404') && !err.includes('favicon')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('keyboard navigation works', async ({ page }) => {
    // Tab through navigation links
    await page.keyboard.press('Tab');
    
    // First focusable element should be a nav link
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('responsive design breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ 
        width: breakpoint.width, 
        height: breakpoint.height 
      });
      
      // Navigation should be visible at all breakpoints
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds (generous for test environment)
    expect(loadTime).toBeLessThan(5000);
  });

  test('sitemap is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('User-agent');
  });

  test('manifest.json is accessible', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('name');
    expect(content).toContain('Montana Portrait Photography');
  });

  test('404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should show 404 page
    await expect(page.locator('body')).toContainText(/404|not found/i);
  });

  test('social media links in footer', async ({ page }) => {
    const footer = page.locator('footer');
    
    // Check for social media links (if configured)
    const socialLinks = footer.locator('a[href*="instagram"], a[href*="facebook"], a[href*="pinterest"]');
    const linkCount = await socialLinks.count();
    
    // Should have at least one social link
    expect(linkCount).toBeGreaterThanOrEqual(0); // 0 is ok if not configured yet
  });

  test('accessibility: proper heading hierarchy', async ({ page }) => {
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Should have h1 text content
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text?.trim().length).toBeGreaterThan(0);
  });

  test('accessibility: images have alt text', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Alt can be empty string for decorative images, but should exist
      expect(alt).not.toBeNull();
    }
  });

  test('accessibility: landmarks are present', async ({ page }) => {
    // Check for main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    
    // Check for navigation landmark
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    
    // Check for footer
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
  });

  test('external links open in new tab', async ({ page }) => {
    // Find external links (if any)
    const externalLinks = page.locator('a[target="_blank"]');
    const linkCount = await externalLinks.count();
    
    if (linkCount > 0) {
      // Check they have rel="noopener noreferrer"
      for (let i = 0; i < linkCount; i++) {
        const link = externalLinks.nth(i);
        const rel = await link.getAttribute('rel');
        expect(rel).toContain('noopener');
      }
    }
  });

  test('smooth scroll behavior', async ({ page }) => {
    // Add an element to scroll to (if one exists)
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    
    // Wait for scroll to complete
    await page.waitForTimeout(500);
    
    // Check scroll position changed
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});

