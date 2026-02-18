import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { HomePage } from '../pages/HomePage.js';
import { TestHelpers, users } from '../utils/test-helpers.js';

test.describe('Authentication', () => {
  let loginPage;
  let registerPage;
  let homePage;
  let testHelpers;

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    homePage = new HomePage(page);
    testHelpers = new TestHelpers(page, request);
  });

  test.describe('User Registration', () => {
    test('should register a new user successfully', async ({ page }) => {
      await registerPage.goto();

      const uniqueEmail = testHelpers.generateRandomEmail();
      const uniqueUsername = testHelpers.generateRandomUsername();

      await registerPage.register(
        uniqueUsername,
        uniqueEmail,
        'testpass123',
        'USER'
      );

      // Should redirect to discover after auto-login
      await expect(page).toHaveURL(/\/discover/);
    });

    test('should register a new photographer successfully', async ({ page }) => {
      await registerPage.goto();

      const uniqueEmail = testHelpers.generateRandomEmail();
      const uniqueUsername = testHelpers.generateRandomUsername();

      await registerPage.register(
        uniqueUsername,
        uniqueEmail,
        'testpass123',
        'PHOTOGRAPHER'
      );

      // Should redirect to photographer dashboard after auto-login
      await expect(page).toHaveURL(/\/profile-dashboard/);
    });

    test('should show error for duplicate email', async ({ page }) => {
      await registerPage.goto();

      // Try to register with existing email
      await registerPage.register(
        'newusername',
        users.testUser.email,
        'testpass123',
        'USER'
      );

      const errorMessage = await registerPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      expect(errorMessage).toContain('already exists' || 'duplicate' || 'taken');
    });

    test('should validate required fields', async ({ page }) => {
      await registerPage.goto();

      // Try to register without filling all fields
      await page.click('[data-testid="register-button"]');

      // Should stay on register page and show validation errors
      expect(await registerPage.isRegisterFormVisible()).toBeTruthy();
    });

    test('should navigate to login page from register page', async ({ page }) => {
      await registerPage.goto();
      await registerPage.clickLoginLink();

      await expect(page).toHaveURL(/\/login/);
      expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    });
  });

  test.describe('User Login', () => {
    test('should login with valid user credentials', async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(users.testUser.email, users.testUser.password);

      // Should redirect to home page
      await expect(page).toHaveURL(/\/(home|discover|\/$)/);

      // Check if user is logged in (navbar should show user menu)
      await homePage.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });

    test('should login with valid photographer credentials', async ({ page }) => {
      await loginPage.goto();

      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);

      // Should redirect to appropriate page
      await expect(page).toHaveURL(/\/(home|profile-dashboard|\/$)/);

      // Check if photographer is logged in
      await homePage.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await loginPage.goto();

      await loginPage.login('invalid@email.com', 'wrongpassword');

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      expect(errorMessage).toContain('Invalid' || 'incorrect' || 'failed');
    });

    test('should show error for empty credentials', async ({ page }) => {
      await loginPage.goto();

      await page.click('[data-testid="login-button"]');

      // Should stay on login page
      expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    });

    test('should navigate to register page from login page', async ({ page }) => {
      await loginPage.goto();
      await loginPage.clickRegisterLink();

      await expect(page).toHaveURL(/\/register/);
      expect(await registerPage.isRegisterFormVisible()).toBeTruthy();
    });
  });

  test.describe('User Logout', () => {
    test('should logout user successfully', async ({ page }) => {
      // First login
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      // Verify logged in
      await homePage.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();

      // Logout
      await homePage.logout();

      // Should redirect to home page and show login/register buttons
      await expect(page).toHaveURL(/\/(home|\/$)/);
      expect(await homePage.isUserLoggedIn()).toBeFalsy();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated user from discover page', async ({ page }) => {
      await page.goto('/discover');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect unauthenticated user from booking page', async ({ page }) => {
      await page.goto('/booking/1');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect unauthenticated user from photographer dashboard', async ({ page }) => {
      await page.goto('/profile-dashboard');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect unauthenticated user from booking manager', async ({ page }) => {
      await page.goto('/manage-bookings');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should allow authenticated user to access discover page', async ({ page }) => {
      // Login first
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      // Navigate to discover page
      await page.goto('/discover');

      // Should stay on discover page
      await expect(page).toHaveURL(/\/discover/);
    });

    test('should allow authenticated photographer to access dashboard', async ({ page }) => {
      // Login as photographer
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);

      // Navigate to photographer dashboard
      await page.goto('/profile-dashboard');

      // Should stay on dashboard page
      await expect(page).toHaveURL(/\/profile-dashboard/);
    });

    test('should prevent regular user from accessing photographer dashboard', async ({ page }) => {
      // Login as regular user
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      // Try to navigate to photographer dashboard
      await page.goto('/profile-dashboard');

      // Should redirect (403/unauthorized or login)
      await expect(page).not.toHaveURL(/\/profile-dashboard/);
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Login
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      await homePage.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();

      // Refresh page
      await page.reload();

      // Should still be logged in
      expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });

    test('should handle expired/invalid tokens gracefully', async ({ page }) => {
      // Login first
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      // Simulate expired token by clearing localStorage/cookies
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Try to access protected route
      await page.goto('/discover');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });
});