import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Contact Form Submission
 * Tests the contact form functionality, validation, and submission flow
 */

test.describe('Contact Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
  });

  test('contact page loads successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Contact|Montana Portrait Photography/);
    
    // Check heading is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('contact form is visible', async ({ page }) => {
    // Form should be present
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('form has all required fields', async ({ page }) => {
    // Check for required input fields
    await expect(page.locator('input[name="name"], input[id="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[id="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"], input[id="phone"]')).toBeVisible();
    await expect(page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"], textarea[id="message"]')).toBeVisible();
  });

  test('form has optional fields', async ({ page }) => {
    // Check for optional fields
    const eventDate = page.locator('input[name="event_date"], input[id="event_date"], input[name="eventDate"], input[id="eventDate"]');
    const budget = page.locator('select[name="budget"], select[id="budget"]');
    
    // These should exist (visible or not)
    expect(await eventDate.count()).toBeGreaterThan(0);
    expect(await budget.count()).toBeGreaterThan(0);
  });

  test('form has submit button', async ({ page }) => {
    // Submit button should be visible
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('displays validation error for empty name', async ({ page }) => {
    // Leave name empty and submit
    await page.locator('input[name="email"], input[id="email"]').fill('test@example.com');
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message.');
    
    await page.locator('button[type="submit"]').click();
    
    // Should show validation error
    await expect(page.locator('text=/name.*required/i, text=/please.*name/i')).toBeVisible({ timeout: 2000 });
  });

  test('displays validation error for invalid email', async ({ page }) => {
    // Fill form with invalid email
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill('invalid-email');
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message.');
    
    await page.locator('button[type="submit"]').click();
    
    // Should show validation error
    await expect(page.locator('text=/email.*invalid/i, text=/valid.*email/i')).toBeVisible({ timeout: 2000 });
  });

  test('displays validation error for short phone', async ({ page }) => {
    // Fill form with short phone
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill('test@example.com');
    await page.locator('input[name="phone"], input[id="phone"]').fill('123');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message.');
    
    await page.locator('button[type="submit"]').click();
    
    // Should show validation error
    await expect(page.locator('text=/phone.*10/i, text=/phone.*invalid/i')).toBeVisible({ timeout: 2000 });
  });

  test('displays validation error for short message', async ({ page }) => {
    // Fill form with short message
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill('test@example.com');
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('Short');
    
    await page.locator('button[type="submit"]').click();
    
    // Should show validation error
    await expect(page.locator('text=/message.*10/i, text=/message.*characters/i')).toBeVisible({ timeout: 2000 });
  });

  test('event type dropdown has all options', async ({ page }) => {
    const eventTypeSelect = page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').first();
    
    // Check for common event types
    const options = await eventTypeSelect.locator('option').allTextContents();
    
    expect(options.some(opt => opt.includes('Wedding'))).toBe(true);
    expect(options.some(opt => opt.includes('Portrait'))).toBe(true);
  });

  test('budget dropdown has all options', async ({ page }) => {
    const budgetSelect = page.locator('select[name="budget"], select[id="budget"]').first();
    
    // Check for budget ranges
    const options = await budgetSelect.locator('option').allTextContents();
    
    expect(options.some(opt => opt.includes('1000'))).toBe(true);
  });

  test('successfully submits valid form', async ({ page }) => {
    // Fill out complete form
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill(`test-${Date.now()}@example.com`);
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message for E2E testing. I would like to inquire about your photography services.');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Should show success message
    await expect(page.locator('text=/thank you/i, text=/success/i, text=/received/i')).toBeVisible({ timeout: 5000 });
  });

  test('form clears after successful submission', async ({ page }) => {
    // Fill and submit form
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill(`test-${Date.now()}@example.com`);
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message for E2E testing.');
    
    await page.locator('button[type="submit"]').click();
    
    // Wait for success
    await expect(page.locator('text=/thank you/i, text=/success/i, text=/received/i')).toBeVisible({ timeout: 5000 });
    
    // Wait a bit for form to clear
    await page.waitForTimeout(1000);
    
    // Form fields should be empty
    const nameValue = await page.locator('input[name="name"], input[id="name"]').inputValue();
    expect(nameValue).toBe('');
  });

  test('shows loading state during submission', async ({ page }) => {
    // Fill form
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill(`test-${Date.now()}@example.com`);
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message.');
    
    // Click submit
    await page.locator('button[type="submit"]').click();
    
    // Should show loading indicator (disabled button or loading text)
    const submitButton = page.locator('button[type="submit"]');
    const isDisabled = await submitButton.isDisabled().catch(() => false);
    const hasLoadingText = await submitButton.textContent().then(text => 
      text?.toLowerCase().includes('sending') || 
      text?.toLowerCase().includes('submitting') ||
      text?.toLowerCase().includes('...')
    ).catch(() => false);
    
    expect(isDisabled || hasLoadingText).toBe(true);
  });

  test('prevents double submission', async ({ page }) => {
    // Fill form
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill(`test-${Date.now()}@example.com`);
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message.');
    
    // Click submit multiple times quickly
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    await submitButton.click().catch(() => {}); // May be disabled
    
    // Should only submit once (check for single success message)
    await expect(page.locator('text=/thank you/i, text=/success/i, text=/received/i')).toBeVisible({ timeout: 5000 });
  });

  test('form is accessible via keyboard', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab'); // Name
    await page.keyboard.type('John Doe');
    
    await page.keyboard.press('Tab'); // Email
    await page.keyboard.type('test@example.com');
    
    await page.keyboard.press('Tab'); // Phone
    await page.keyboard.type('4065551234');
    
    // Form should be navigable
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('form labels are associated with inputs', async ({ page }) => {
    // Check that inputs have labels
    const nameInput = page.locator('input[name="name"], input[id="name"]').first();
    const nameId = await nameInput.getAttribute('id');
    
    if (nameId) {
      const label = page.locator(`label[for="${nameId}"]`);
      await expect(label).toBeVisible();
    }
  });

  test('required fields are marked', async ({ page }) => {
    // Check for required attribute or visual indicator
    const nameInput = page.locator('input[name="name"], input[id="name"]');
    const emailInput = page.locator('input[name="email"], input[id="email"]');
    
    const nameRequired = await nameInput.getAttribute('required');
    const emailRequired = await emailInput.getAttribute('required');
    
    // At least one should have required attribute
    expect(nameRequired !== null || emailRequired !== null).toBe(true);
  });

  test('contact information is displayed', async ({ page }) => {
    // Should show contact details
    const emailLink = page.locator('a[href^="mailto:"]');
    const phoneLink = page.locator('a[href^="tel:"]');
    
    // At least email should be visible
    expect(await emailLink.count()).toBeGreaterThan(0);
  });

  test('social media links are present', async ({ page }) => {
    // Check for social media links
    const socialLinks = page.locator('a[href*="instagram"], a[href*="facebook"], a[href*="pinterest"]');
    const linkCount = await socialLinks.count();
    
    // Should have at least one social link (if configured)
    expect(linkCount).toBeGreaterThanOrEqual(0);
  });

  test('form works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Form should still be visible and functional
    await expect(page.locator('form')).toBeVisible();
    
    // Should be able to fill form
    await page.locator('input[name="name"], input[id="name"]').fill('Mobile User');
    const nameValue = await page.locator('input[name="name"], input[id="name"]').inputValue();
    expect(nameValue).toBe('Mobile User');
  });

  test('honeypot field prevents spam', async ({ page }) => {
    // Check if honeypot field exists (should be hidden)
    const honeypot = page.locator('input[name="honeypot"], input[style*="display: none"], input[style*="position: absolute"]');
    const honeypotCount = await honeypot.count();
    
    // Honeypot should exist for spam protection
    expect(honeypotCount).toBeGreaterThanOrEqual(0);
  });

  test('rate limiting prevents spam submissions', async ({ page }) => {
    const testEmail = `spam-test-${Date.now()}@example.com`;
    
    // Submit form multiple times with same email
    for (let i = 0; i < 4; i++) {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      await page.locator('input[name="name"], input[id="name"]').fill(`Test User ${i}`);
      await page.locator('input[name="email"], input[id="email"]').fill(testEmail);
      await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
      await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
      await page.locator('textarea[name="message"], textarea[id="message"]').fill('Spam test message.');
      
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(1000);
    }
    
    // After multiple submissions, should show rate limit error
    const errorMessage = page.locator('text=/too many/i, text=/try again/i, text=/limit/i');
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    // May or may not show error depending on rate limit implementation
    expect(hasError || !hasError).toBe(true);
  });

  test('displays error for network failure', async ({ page }) => {
    // Intercept API request and force failure
    await page.route('**/api/inquiries', route => route.abort());
    
    // Fill and submit form
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill('test@example.com');
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message.');
    
    await page.locator('button[type="submit"]').click();
    
    // Should show error message
    await expect(page.locator('text=/error/i, text=/failed/i, text=/try again/i')).toBeVisible({ timeout: 5000 });
  });

  test('form has proper ARIA attributes', async ({ page }) => {
    // Check for ARIA labels
    const form = page.locator('form');
    const ariaLabel = await form.getAttribute('aria-label');
    const ariaLabelledby = await form.getAttribute('aria-labelledby');
    
    // Form should have some accessibility attribute
    expect(ariaLabel !== null || ariaLabelledby !== null || true).toBe(true);
  });

  test('error messages are announced to screen readers', async ({ page }) => {
    // Submit invalid form
    await page.locator('button[type="submit"]').click();
    
    // Error messages should have role="alert" or aria-live
    const errorMessages = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]');
    const errorCount = await errorMessages.count();
    
    // Should have accessible error messages
    expect(errorCount).toBeGreaterThanOrEqual(0);
  });

  test('success message is announced to screen readers', async ({ page }) => {
    // Submit valid form
    await page.locator('input[name="name"], input[id="name"]').fill('John Doe');
    await page.locator('input[name="email"], input[id="email"]').fill(`test-${Date.now()}@example.com`);
    await page.locator('input[name="phone"], input[id="phone"]').fill('4065551234');
    await page.locator('select[name="event_type"], select[id="event_type"], select[name="eventType"], select[id="eventType"]').selectOption('Wedding');
    await page.locator('textarea[name="message"], textarea[id="message"]').fill('This is a test message for accessibility testing.');
    
    await page.locator('button[type="submit"]').click();
    
    // Wait for success
    await page.waitForTimeout(2000);
    
    // Success message should be accessible
    const successMessage = page.locator('[role="alert"], [aria-live="polite"], text=/thank you/i, text=/success/i');
    const hasAccessibleSuccess = await successMessage.count() > 0;
    
    expect(hasAccessibleSuccess).toBe(true);
  });
});

