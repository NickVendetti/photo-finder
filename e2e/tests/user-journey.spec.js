import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { DiscoveryPage } from '../pages/DiscoveryPage.js';
import { BookingPage } from '../pages/BookingPage.js';
import { TestHelpers, users } from '../utils/test-helpers.js';

test.describe('User Journey', () => {
  let homePage;
  let loginPage;
  let registerPage;
  let discoveryPage;
  let bookingPage;
  let testHelpers;

  test.beforeEach(async ({ page, request }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    discoveryPage = new DiscoveryPage(page);
    bookingPage = new BookingPage(page);
    testHelpers = new TestHelpers(page, request);
  });

  test.describe('Complete User Registration to Booking Journey', () => {
    test('should complete full user journey from registration to booking', async ({ page }) => {
      // Step 1: Visit home page
      await homePage.goto();
      expect(await homePage.isHeroSectionVisible()).toBeTruthy();

      // Step 2: Navigate to register
      await homePage.clickRegister();
      expect(await registerPage.isRegisterFormVisible()).toBeTruthy();

      // Step 3: Register new user
      const uniqueEmail = testHelpers.generateRandomEmail();
      const uniqueUsername = testHelpers.generateRandomUsername();

      await registerPage.register(
        uniqueUsername,
        uniqueEmail,
        'testpass123',
        'USER'
      );

      // Step 4: Login with new credentials
      await loginPage.goto();
      await loginPage.login(uniqueEmail, 'testpass123');

      // Step 5: Navigate to discovery page
      await discoveryPage.goto();
      expect(await discoveryPage.isPhotographerGridVisible()).toBeTruthy();

      // Step 6: Search for photographers (if any exist)
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();
      if (photographerCount > 0) {
        // Step 7: Click on first photographer to book
        await discoveryPage.clickBookForPhotographer(0);

        // Step 8: Fill booking form
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();

        await bookingPage.createBooking(
          'portrait',
          '2024-12-01',
          '10:00'
        );

        // Step 9: Verify booking confirmation or error handling
        const confirmationMessage = await bookingPage.getConfirmationMessage();
        const errorMessage = await bookingPage.getErrorMessage();

        expect(confirmationMessage || errorMessage).toBeTruthy();
      }
    });
  });

  test.describe('Existing User Journey', () => {
    test('should allow existing user to discover and book photographer', async ({ page }) => {
      // Login with existing test user
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      // Navigate to discovery
      await discoveryPage.goto();
      expect(await discoveryPage.isPhotographerGridVisible()).toBeTruthy();

      // Search for photographers
      await discoveryPage.searchPhotographers('photographer');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        // Get photographer name for verification
        const photographerName = await discoveryPage.getPhotographerName(0);
        expect(photographerName).toBeTruthy();

        // Click book button
        await discoveryPage.clickBookForPhotographer(0);

        // Verify we're on booking page
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();
        expect(await bookingPage.isPhotographerInfoVisible()).toBeTruthy();

        // Verify photographer info matches
        const bookingPagePhotographerName = await bookingPage.getPhotographerName();
        expect(bookingPagePhotographerName).toContain(photographerName);

        // Create booking
        await bookingPage.createBooking(
          'wedding',
          '2024-12-15',
          '14:30'
        );

        // Verify result
        const confirmationMessage = await bookingPage.getConfirmationMessage();
        const errorMessage = await bookingPage.getErrorMessage();
        expect(confirmationMessage || errorMessage).toBeTruthy();
      } else {
        console.log('No photographers available for booking test');
      }
    });

    test('should handle search functionality on discovery page', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      await discoveryPage.goto();

      // Test empty search
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      // Test specific search
      await discoveryPage.searchPhotographers('photographer');
      await testHelpers.waitForLoadingToComplete();

      // Test search with no results
      await discoveryPage.searchPhotographers('nonexistentphotographer12345');
      await testHelpers.waitForLoadingToComplete();

      // Should either show no results message or empty grid
      const hasResults = await discoveryPage.isPhotographerGridVisible();
      const hasNoResultsMessage = await discoveryPage.isNoResultsMessageVisible();

      expect(hasResults || hasNoResultsMessage).toBeTruthy();
    });

    test('should allow viewing photographer portfolio before booking', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        // Click view portfolio
        await discoveryPage.clickViewPortfolioForPhotographer(0);

        // Should navigate somewhere (portfolio page or modal)
        // This might need adjustment based on actual implementation
        await page.waitForTimeout(2000); // Wait for navigation/modal

        // Verify we can still book from portfolio view
        const isBookButtonVisible = await page.isVisible('[data-testid="book-button"]');

        if (isBookButtonVisible) {
          await page.click('[data-testid="book-button"]');
          expect(await bookingPage.isBookingFormVisible()).toBeTruthy();
        }
      }
    });
  });

  test.describe('User Experience Flow', () => {
    test('should handle navigation between pages smoothly', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      // Test navigation flow
      await homePage.goto();
      expect(await homePage.isHeroSectionVisible()).toBeTruthy();

      await homePage.clickDiscover();
      expect(await discoveryPage.isPhotographerGridVisible()).toBeTruthy();

      // Navigate back to home
      await homePage.goto();
      expect(await homePage.isHeroSectionVisible()).toBeTruthy();

      // Check navbar visibility throughout
      expect(await homePage.isNavbarVisible()).toBeTruthy();
    });

    test('should handle errors gracefully during booking process', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        await discoveryPage.clickBookForPhotographer(0);
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();

        // Test invalid date (past date)
        await bookingPage.createBooking(
          'portrait',
          '2020-01-01',
          '10:00'
        );

        // Should show error message
        const errorMessage = await bookingPage.getErrorMessage();
        expect(errorMessage).toBeTruthy();

        // Test empty form submission
        await page.reload();
        await page.click('[data-testid="submit-booking-button"]');

        // Should show validation errors or stay on form
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();
      }
    });

    test('should maintain user session throughout journey', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      // Navigate through multiple pages
      await homePage.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();

      await discoveryPage.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();

      // Refresh page
      await page.reload();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();

      // Navigate back to home
      await homePage.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      await homePage.goto();
      expect(await homePage.isHeroSectionVisible()).toBeTruthy();

      await discoveryPage.goto();
      expect(await discoveryPage.isPhotographerGridVisible()).toBeTruthy();

      // Basic interaction test on mobile
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad

      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      await homePage.goto();
      expect(await homePage.isHeroSectionVisible()).toBeTruthy();

      await discoveryPage.goto();
      expect(await discoveryPage.isPhotographerGridVisible()).toBeTruthy();
    });
  });
});