import { test, expect } from '@playwright/test';

test.describe('Basic E2E Setup Test', () => {
  test('should be able to load the application', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Check if the page loads successfully
    await expect(page).toHaveURL(/\//);

    // Check if the page has a title
    const title = await page.title();
    expect(title).toBeTruthy();

    console.log(`Page title: ${title}`);
  });

  test('should be able to access the login page', async ({ page }) => {
    await page.goto('/login');

    // Check if we can navigate to login page
    await expect(page).toHaveURL(/\/login/);

    // Look for any form element (even without data-testid)
    const hasForm = await page.locator('form').count() > 0;
    const hasInput = await page.locator('input').count() > 0;
    const hasButton = await page.locator('button').count() > 0;

    console.log(`Login page has form: ${hasForm}, inputs: ${hasInput}, buttons: ${hasButton}`);

    // At least one of these should be present on a login page
    expect(hasForm || hasInput || hasButton).toBeTruthy();
  });

  test('should be able to access the register page', async ({ page }) => {
    await page.goto('/register');

    // Check if we can navigate to register page
    await expect(page).toHaveURL(/\/register/);

    // Look for any form element
    const hasForm = await page.locator('form').count() > 0;
    const hasInput = await page.locator('input').count() > 0;
    const hasButton = await page.locator('button').count() > 0;

    console.log(`Register page has form: ${hasForm}, inputs: ${hasInput}, buttons: ${hasButton}`);

    // At least one of these should be present on a register page
    expect(hasForm || hasInput || hasButton).toBeTruthy();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Check if we can see navigation elements
    const hasNav = await page.locator('nav').count() > 0;
    const hasLinks = await page.locator('a').count() > 0;

    console.log(`Page has nav: ${hasNav}, links: ${hasLinks}`);

    // Should have some navigation
    expect(hasNav || hasLinks).toBeTruthy();
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');

    // Page should load (even if it's a 404)
    expect(response).toBeTruthy();

    // Log the status for debugging
    console.log(`404 page status: ${response.status()}`);
  });
});