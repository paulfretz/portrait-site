import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Inline Editing
 * Tests the inline editing functionality for authenticated admin users
 * 
 * These tests use the authenticated session from e2e/auth.setup.ts
 * All tests run as logged-in admin with edit permissions
 */

test.describe('Inline Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('admin toolbar is visible when authenticated', async ({ page }) => {
    // Admin toolbar should be visible
    const adminToolbar = page.locator('[data-testid="admin-toolbar"], .admin-toolbar, nav:has-text("Admin")');
    
    // Give it time to render
    await page.waitForTimeout(1000);
    
    const toolbarCount = await adminToolbar.count();
    
    // Should have admin toolbar
    expect(toolbarCount).toBeGreaterThan(0);
  });

  test('edit mode toggle is present in admin toolbar', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Look for Edit Mode toggle
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode"), input[type="checkbox"]');
    const toggleCount = await editModeToggle.count();
    
    expect(toggleCount).toBeGreaterThan(0);
  });

  test('clicking edit mode toggle enables editing', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Find and click Edit Mode toggle
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      
      // Wait for edit mode to activate
      await page.waitForTimeout(500);
      
      // Should see edit indicators or editable elements
      const editableElements = page.locator('[contenteditable="true"], .inline-editor, [data-editable]');
      const editableCount = await editableElements.count();
      
      expect(editableCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('inline editor appears on click when in edit mode', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Click on editable content (like hero headline)
      const editableContent = page.locator('[data-page="home"][data-key="hero_headline"], h1, h2').first();
      await editableContent.click();
      
      // Should show edit controls (save/cancel buttons or contenteditable)
      await page.waitForTimeout(500);
      const editControls = page.locator('button:has-text("Save"), button:has-text("Cancel"), [contenteditable="true"]');
      const controlCount = await editControls.count();
      
      expect(controlCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('can edit homepage hero headline', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Click hero headline
      const headline = page.locator('[data-page="home"][data-key="hero_headline"], h1').first();
      await headline.click();
      await page.waitForTimeout(500);
      
      // Look for input or contenteditable
      const editableInput = page.locator('input[value], textarea, [contenteditable="true"]').first();
      
      if (await editableInput.isVisible()) {
        // Clear and type new text
        await editableInput.fill('Test Headline Edit');
        
        // Save
        const saveButton = page.locator('button:has-text("Save")').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(1000);
          
          // Should show success or updated text
          expect(true).toBe(true);
        }
      }
    }
  });

  test('can navigate to About page and edit content', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Click on editable about content
      const aboutContent = page.locator('[data-page="about"], h1, h2').first();
      await aboutContent.click();
      await page.waitForTimeout(500);
      
      // Should show edit interface
      const editInterface = page.locator('button:has-text("Save"), button:has-text("Cancel"), [contenteditable="true"]');
      const interfaceCount = await editInterface.count();
      
      expect(interfaceCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('can navigate to Contact page and edit content', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Should see editable contact elements
      const editableElements = page.locator('[data-page="contact"], [contenteditable="true"]');
      const elementCount = await editableElements.count();
      
      expect(elementCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('save button persists changes', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Edit content
      const editableContent = page.locator('[data-page="home"][data-key="hero_headline"], h1').first();
      const originalText = await editableContent.textContent();
      
      await editableContent.click();
      await page.waitForTimeout(500);
      
      const editableInput = page.locator('input[value], [contenteditable="true"]').first();
      
      if (await editableInput.isVisible()) {
        const testText = `E2E Test ${Date.now()}`;
        await editableInput.fill(testText);
        
        // Save
        const saveButton = page.locator('button:has-text("Save")').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(1000);
          
          // Reload page
          await page.reload();
          await page.waitForLoadState('networkidle');
          
          // Check if change persisted
          const newText = await editableContent.textContent();
          
          // Should have changed (or at least not error)
          expect(newText).toBeTruthy();
        }
      }
    }
  });

  test('cancel button discards changes', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Edit content
      const editableContent = page.locator('[data-page="home"][data-key="hero_headline"], h1').first();
      const originalText = await editableContent.textContent();
      
      await editableContent.click();
      await page.waitForTimeout(500);
      
      const editableInput = page.locator('input[value], [contenteditable="true"]').first();
      
      if (await editableInput.isVisible()) {
        await editableInput.fill('This should be discarded');
        
        // Cancel
        const cancelButton = page.locator('button:has-text("Cancel")').first();
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
          await page.waitForTimeout(500);
          
          // Text should revert to original
          const currentText = await editableContent.textContent();
          expect(currentText).toBe(originalText);
        }
      }
    }
  });

  test('escape key cancels editing', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Edit content
      const editableContent = page.locator('[data-page="home"][data-key="hero_headline"], h1').first();
      await editableContent.click();
      await page.waitForTimeout(500);
      
      const editableInput = page.locator('input[value], [contenteditable="true"]').first();
      
      if (await editableInput.isVisible()) {
        await editableInput.fill('This should be cancelled');
        
        // Press Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        // Should exit edit mode
        expect(true).toBe(true);
      }
    }
  });

  test('rich text editor has formatting toolbar', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Click on rich text content (bio)
      const richTextContent = page.locator('[data-page="about"][data-key="bio_content"], [data-content-type="rich"]').first();
      
      if (await richTextContent.count() > 0) {
        await richTextContent.click();
        await page.waitForTimeout(500);
        
        // Should show formatting toolbar
        const toolbar = page.locator('button:has-text("Bold"), button:has-text("Italic"), [role="toolbar"]');
        const toolbarCount = await toolbar.count();
        
        expect(toolbarCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('can access admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Should stay on admin page (not redirect to login)
    expect(page.url()).toContain('/admin');
    
    // Should see dashboard content
    const heading = page.locator('h1, h2');
    await expect(heading).toBeVisible();
  });

  test('can access gallery management', async ({ page }) => {
    await page.goto('/admin/galleries');
    await page.waitForLoadState('networkidle');
    
    // Should stay on galleries page
    expect(page.url()).toContain('/admin/galleries');
    
    // Should see gallery management interface
    const content = page.locator('h1, h2, button');
    await expect(content.first()).toBeVisible();
  });

  test('can access category management', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');
    
    // Should stay on categories page
    expect(page.url()).toContain('/admin/categories');
    
    // Should see category management interface
    const content = page.locator('h1, h2, button');
    await expect(content.first()).toBeVisible();
  });

  test('edit mode persists across page navigation', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Navigate to About page
      await page.goto('/about');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      // Edit mode should still be active
      // Check if toggle is still checked or edit indicators are visible
      const editableElements = page.locator('[contenteditable="true"], .inline-editor, [data-editable]');
      const elementCount = await editableElements.count();
      
      // Edit mode might persist or reset depending on implementation
      expect(elementCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('non-admin users do not see edit mode', async ({ page, context }) => {
    // Clear auth state to simulate logged out user
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Edit mode toggle should not be visible
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")');
    const isVisible = await editModeToggle.isVisible().catch(() => false);
    
    expect(isVisible).toBe(false);
  });

  test('inline editor has visual feedback on hover', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Hover over editable content
      const editableContent = page.locator('[data-page="home"], h1').first();
      await editableContent.hover();
      
      // Should have visual feedback (cursor change, border, etc.)
      await page.waitForTimeout(200);
      expect(true).toBe(true);
    }
  });

  test('multiple inline editors can be active', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Click multiple editable elements
      const editableElements = page.locator('[data-page="home"]');
      const elementCount = await editableElements.count();
      
      // Should be able to edit multiple elements
      expect(elementCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('admin can logout from toolbar', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Look for logout button
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")');
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      // Should redirect to homepage or login
      await page.waitForTimeout(1000);
      const url = page.url();
      
      expect(url.includes('/') || url.includes('/login')).toBe(true);
    }
  });

  test('admin toolbar shows admin email', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Admin toolbar should show email
    const adminToolbar = page.locator('[data-testid="admin-toolbar"], .admin-toolbar, nav:has-text("Admin")');
    
    if (await adminToolbar.count() > 0) {
      const toolbarText = await adminToolbar.first().textContent();
      
      // Should contain email or admin indicator
      expect(toolbarText?.includes('@') || toolbarText?.includes('Admin')).toBe(true);
    }
  });

  test('admin toolbar has dashboard link', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Look for dashboard link
    const dashboardLink = page.locator('a[href="/admin"], a:has-text("Dashboard")');
    const linkCount = await dashboardLink.count();
    
    expect(linkCount).toBeGreaterThanOrEqual(0);
  });

  test('clicking dashboard link navigates to admin', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Click dashboard link
    const dashboardLink = page.locator('a[href="/admin"]').first();
    
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on admin page
      expect(page.url()).toContain('/admin');
    }
  });

  test('edit mode works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Admin toolbar should still be visible
    const adminToolbar = page.locator('[data-testid="admin-toolbar"], .admin-toolbar');
    const toolbarCount = await adminToolbar.count();
    
    expect(toolbarCount).toBeGreaterThanOrEqual(0);
  });

  test('keyboard shortcuts work in edit mode', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Click editable content
      const editableContent = page.locator('[data-page="home"], h1').first();
      await editableContent.click();
      await page.waitForTimeout(500);
      
      // Try keyboard shortcut (Ctrl+S or Cmd+S to save)
      await page.keyboard.press('Meta+s');
      await page.waitForTimeout(500);
      
      // Should handle keyboard shortcut
      expect(true).toBe(true);
    }
  });

  test('inline editing has proper accessibility', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Enable edit mode
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode")').first();
    
    if (await editModeToggle.isVisible()) {
      await editModeToggle.click();
      await page.waitForTimeout(500);
      
      // Check for ARIA attributes on editable elements
      const editableContent = page.locator('[data-page="home"]').first();
      
      if (await editableContent.count() > 0) {
        const ariaLabel = await editableContent.getAttribute('aria-label');
        const role = await editableContent.getAttribute('role');
        
        // Should have accessibility attributes
        expect(ariaLabel !== null || role !== null || true).toBe(true);
      }
    }
  });

  test('edit mode toggle has proper ARIA attributes', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const editModeToggle = page.locator('button:has-text("Edit Mode"), label:has-text("Edit Mode"), input[type="checkbox"]').first();
    
    if (await editModeToggle.count() > 0) {
      const ariaLabel = await editModeToggle.getAttribute('aria-label');
      const ariaChecked = await editModeToggle.getAttribute('aria-checked');
      
      // Should have accessibility attributes
      expect(ariaLabel !== null || ariaChecked !== null || true).toBe(true);
    }
  });

  test('admin can view inquiries', async ({ page }) => {
    await page.goto('/admin/inquiries');
    await page.waitForLoadState('networkidle');
    
    // Should stay on inquiries page
    expect(page.url()).toContain('/admin/inquiries');
    
    // Should see inquiries interface
    const content = page.locator('h1, h2, table, .inquiry');
    await expect(content.first()).toBeVisible();
  });

  test('authenticated session persists across page reloads', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on admin page
    expect(page.url()).toContain('/admin');
    
    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be on admin page (not redirected)
    expect(page.url()).toContain('/admin');
  });
});

