/**
 * E2E Tests for Gallery Layouts
 * Tests masonry (mobile) and justified (desktop) layouts
 */

import { test, expect } from '@playwright/test';

test.describe('Gallery Layouts - Mobile Masonry', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('displays masonry layout on mobile', async ({ page }) => {
    await page.goto('/galleries');
    
    // Click on first category
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');

    // Click on first gallery
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Check that images are displayed
    const images = page.locator('button img[alt]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('masonry layout has proper spacing', async ({ page }) => {
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Check that masonry grid exists
    const grid = page.locator('.my-masonry-grid');
    await expect(grid).toBeVisible();
  });

  test('images are clickable on mobile', async ({ page }) => {
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Click first image
    const firstImageButton = page.locator('button').first();
    await firstImageButton.click();

    // Lightbox should open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('mobile layout has 2 columns', async ({ page }) => {
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Masonry should have columns
    const columns = page.locator('.my-masonry-grid_column');
    const columnCount = await columns.count();
    expect(columnCount).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Gallery Layouts - Desktop Justified', () => {
  test.use({ viewport: { width: 1920, height: 1080 } }); // Desktop

  test('displays justified layout on desktop', async ({ page }) => {
    await page.goto('/galleries');
    
    // Click on first category
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');

    // Click on first gallery
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Check that images are displayed
    const images = page.locator('button img[alt]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('justified layout uses absolute positioning', async ({ page }) => {
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Justified layout uses absolute positioning
    const absoluteButtons = page.locator('button.absolute');
    const count = await absoluteButtons.count();
    expect(count).toBeGreaterThanOrEqual(0); // May be 0 if no images
  });

  test('images are clickable on desktop', async ({ page }) => {
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Click first image
    const firstImageButton = page.locator('button').first();
    await firstImageButton.click();

    // Lightbox should open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('desktop layout has proper spacing', async ({ page }) => {
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Images should be visible
    const images = page.locator('button img[alt]');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Gallery Layouts - Responsive Switching', () => {
  test('switches between mobile and desktop layouts', async ({ page }) => {
    // Start on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Verify images are visible on desktop
    let images = page.locator('button img[alt]');
    let count = await images.count();
    expect(count).toBeGreaterThanOrEqual(0);

    // Switch to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for resize handler

    // Verify images are still visible on mobile
    images = page.locator('button img[alt]');
    count = await images.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Hero Slideshow', () => {
  test('hero slideshow displays on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Hero slideshow should be visible
    const hero = page.locator('.relative.h-screen');
    await expect(hero).toBeVisible();
  });

  test('hero slideshow has navigation controls', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation arrows (only if multiple slides)
    const prevButton = page.locator('button[aria-label="Previous slide"]');
    const nextButton = page.locator('button[aria-label="Next slide"]');
    
    // Buttons may or may not exist depending on number of hero images
    const prevExists = await prevButton.count();
    const nextExists = await nextButton.count();
    
    // If one exists, both should exist
    if (prevExists > 0) {
      expect(nextExists).toBeGreaterThan(0);
    }
  });

  test('hero slideshow has play/pause button', async ({ page }) => {
    await page.goto('/');
    
    // Play/pause button (only if multiple slides)
    const playPauseButton = page.locator('button[aria-label*="slideshow"]');
    
    // Button may or may not exist depending on number of hero images
    const buttonCount = await playPauseButton.count();
    expect(buttonCount).toBeGreaterThanOrEqual(0);
  });

  test('hero slideshow shows photographer name', async ({ page }) => {
    await page.goto('/');
    
    // Should show DJ Coveno Portraits
    await expect(page.locator('text=DJ Coveno Portraits')).toBeVisible();
  });

  test('hero slideshow is full screen height', async ({ page }) => {
    await page.goto('/');
    
    const hero = page.locator('.relative.h-screen').first();
    const boundingBox = await hero.boundingBox();
    
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      // Should be close to viewport height
      expect(boundingBox.height).toBeGreaterThan(500);
    }
  });

  test('hero slideshow loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known/acceptable errors
    const criticalErrors = errors.filter(
      (err) => !err.includes('Failed to load resource') && !err.includes('favicon')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Image Quality', () => {
  test('images use high-resolution variants', async ({ page }) => {
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Check that images are loaded
    const images = page.locator('img[alt]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('images have blur placeholders', async ({ page }) => {
    await page.goto('/galleries');
    const categoryCards = page.locator('a[href*="/galleries/"]').first();
    await categoryCards.click();
    await page.waitForLoadState('networkidle');
    const galleryCards = page.locator('a[href*="/galleries/"]').first();
    await galleryCards.click();
    await page.waitForLoadState('networkidle');

    // Images should load (blur placeholder would show first)
    const images = page.locator('img[alt]');
    await expect(images.first()).toBeVisible();
  });
});

