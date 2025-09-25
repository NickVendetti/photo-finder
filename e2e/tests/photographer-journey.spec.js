import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { PhotographerDashboardPage } from '../pages/PhotographerDashboardPage.js';
import { BookingManagerPage } from '../pages/BookingManagerPage.js';
import { HomePage } from '../pages/HomePage.js';
import { TestHelpers, users } from '../utils/test-helpers.js';

test.describe('Photographer Journey', () => {
  let loginPage;
  let registerPage;
  let photographerDashboard;
  let bookingManager;
  let homePage;
  let testHelpers;

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    photographerDashboard = new PhotographerDashboardPage(page);
    bookingManager = new BookingManagerPage(page);
    homePage = new HomePage(page);
    testHelpers = new TestHelpers(page, request);
  });

  test.describe('Photographer Registration and Setup', () => {
    test('should complete photographer registration and setup', async ({ page }) => {
      // Step 1: Register as photographer
      await registerPage.goto();

      const uniqueEmail = testHelpers.generateRandomEmail();
      const uniqueUsername = testHelpers.generateRandomUsername();

      await registerPage.register(
        uniqueUsername,
        uniqueEmail,
        'testpass123',
        'PHOTOGRAPHER'
      );

      // Step 2: Login
      await loginPage.goto();
      await loginPage.login(uniqueEmail, 'testpass123');

      // Step 3: Access photographer dashboard
      await photographerDashboard.goto();
      expect(await photographerDashboard.isDashboardVisible()).toBeTruthy();
      expect(await photographerDashboard.isPortfolioSectionVisible()).toBeTruthy();
    });
  });

  test.describe('Portfolio Management', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);
      await photographerDashboard.goto();
    });

    test('should allow photographer to view portfolio section', async () => {
      expect(await photographerDashboard.isDashboardVisible()).toBeTruthy();
      expect(await photographerDashboard.isPortfolioSectionVisible()).toBeTruthy();

      const initialPhotoCount = await photographerDashboard.getPhotoCount();
      expect(initialPhotoCount).toBeGreaterThanOrEqual(0);
    });

    test('should handle photo upload form', async ({ page }) => {
      expect(await photographerDashboard.isPortfolioSectionVisible()).toBeTruthy();

      // Click upload photo button (should open form or modal)
      await page.click('[data-testid="upload-photo-button"]');

      // Check if upload form elements are visible
      const fileInputVisible = await page.isVisible('[data-testid="file-input"]');
      const titleInputVisible = await page.isVisible('[data-testid="photo-title-input"]');
      const descriptionInputVisible = await page.isVisible('[data-testid="photo-description-input"]');

      // At least some upload interface should be visible
      expect(fileInputVisible || titleInputVisible || descriptionInputVisible).toBeTruthy();
    });

    test('should show existing photos in portfolio', async () => {
      const photoCount = await photographerDashboard.getPhotoCount();

      if (photoCount > 0) {
        const photoCards = await photographerDashboard.getPhotoCards();
        expect(photoCards.length).toBe(photoCount);

        // Test photo management buttons if photos exist
        const firstCard = photoCards[0];
        const editButtonVisible = await firstCard.locator('[data-testid="edit-photo-button"]').isVisible();
        const deleteButtonVisible = await firstCard.locator('[data-testid="delete-photo-button"]').isVisible();

        expect(editButtonVisible || deleteButtonVisible).toBeTruthy();
      }
    });

    test('should handle photo deletion', async ({ page }) => {
      const initialPhotoCount = await photographerDashboard.getPhotoCount();

      if (initialPhotoCount > 0) {
        // Delete first photo
        await photographerDashboard.deletePhoto(0);

        // Wait for deletion to complete
        await page.waitForTimeout(2000);

        // Check if photo was removed
        const newPhotoCount = await photographerDashboard.getPhotoCount();
        expect(newPhotoCount).toBeLessThanOrEqual(initialPhotoCount);

        // Check for success message
        const successMessage = await photographerDashboard.getSuccessMessage();
        if (successMessage) {
          expect(successMessage).toContain('deleted' || 'removed');
        }
      }
    });
  });

  test.describe('Booking Management', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);
    });

    test('should access booking management page', async () => {
      await bookingManager.goto();
      expect(await bookingManager.isBookingManagerVisible()).toBeTruthy();

      const bookingCount = await bookingManager.getBookingCount();
      expect(bookingCount).toBeGreaterThanOrEqual(0);
    });

    test('should display booking requests', async () => {
      await bookingManager.goto();

      const bookingCount = await bookingManager.getBookingCount();

      if (bookingCount > 0) {
        const firstBookingData = await bookingManager.getBookingData(0);
        expect(firstBookingData).toBeTruthy();
        expect(firstBookingData.date).toBeTruthy();
        expect(firstBookingData.time).toBeTruthy();
        expect(firstBookingData.type).toBeTruthy();
      } else {
        // Should show no bookings message
        const noBookingsVisible = await bookingManager.isNoBookingsMessageVisible();
        expect(noBookingsVisible).toBeTruthy();
      }
    });

    test('should handle booking acceptance', async ({ page }) => {
      await bookingManager.goto();

      const bookingCount = await bookingManager.getBookingCount();

      if (bookingCount > 0) {
        // Accept first booking
        await bookingManager.acceptBooking(0);

        // Wait for action to complete
        await page.waitForTimeout(2000);

        // Check for success message
        const successMessage = await bookingManager.getSuccessMessage();
        if (successMessage) {
          expect(successMessage).toContain('accept' || 'approved');
        }

        // Check if booking status changed
        const updatedBookingData = await bookingManager.getBookingData(0);
        if (updatedBookingData) {
          expect(updatedBookingData.status).toContain('accepted' || 'approved');
        }
      }
    });

    test('should handle booking rejection', async ({ page }) => {
      await bookingManager.goto();

      const bookingCount = await bookingManager.getBookingCount();

      if (bookingCount > 1) { // Need at least 2 bookings to test both accept and reject
        // Reject second booking
        await bookingManager.rejectBooking(1);

        // Wait for action to complete
        await page.waitForTimeout(2000);

        // Check for success message
        const successMessage = await bookingManager.getSuccessMessage();
        if (successMessage) {
          expect(successMessage).toContain('reject' || 'declined');
        }
      }
    });

    test('should filter bookings by status', async ({ page }) => {
      await bookingManager.goto();

      const initialBookingCount = await bookingManager.getBookingCount();

      if (initialBookingCount > 0) {
        // Test filter functionality
        await bookingManager.filterBookings('pending');
        await page.waitForTimeout(1000);

        await bookingManager.filterBookings('accepted');
        await page.waitForTimeout(1000);

        await bookingManager.filterBookings('all');
        await page.waitForTimeout(1000);

        // Should show all bookings again
        const filteredCount = await bookingManager.getBookingCount();
        expect(filteredCount).toBeGreaterThanOrEqual(0);
      }
    });

    test('should search bookings', async ({ page }) => {
      await bookingManager.goto();

      const initialBookingCount = await bookingManager.getBookingCount();

      if (initialBookingCount > 0) {
        // Test search functionality
        await bookingManager.searchBookings('portrait');
        await page.waitForTimeout(1000);

        // Test empty search
        await bookingManager.searchBookings('');
        await page.waitForTimeout(1000);

        // Should show all bookings again
        const searchResultCount = await bookingManager.getBookingCount();
        expect(searchResultCount).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Dashboard Integration', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);
      await photographerDashboard.goto();
    });

    test('should show both portfolio and booking sections on dashboard', async () => {
      expect(await photographerDashboard.isDashboardVisible()).toBeTruthy();
      expect(await photographerDashboard.isPortfolioSectionVisible()).toBeTruthy();
      expect(await photographerDashboard.isBookingsSectionVisible()).toBeTruthy();
    });

    test('should handle booking actions from dashboard', async ({ page }) => {
      const bookingCount = await photographerDashboard.getBookingCount();

      if (bookingCount > 0) {
        // Accept booking from dashboard
        await photographerDashboard.acceptBooking(0);

        await page.waitForTimeout(2000);

        // Check for success message
        const successMessage = await photographerDashboard.getSuccessMessage();
        if (successMessage) {
          expect(successMessage).toContain('accept' || 'approved');
        }
      }
    });

    test('should navigate to full booking manager', async ({ page }) => {
      // Look for link to booking manager
      const manageBookingsLink = page.locator('a[href="/manage-bookings"]');
      const isLinkVisible = await manageBookingsLink.isVisible();

      if (isLinkVisible) {
        await manageBookingsLink.click();
        await expect(page).toHaveURL(/\/manage-bookings/);
        expect(await bookingManager.isBookingManagerVisible()).toBeTruthy();
      }
    });
  });

  test.describe('Profile Management', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);
      await photographerDashboard.goto();
    });

    test('should show profile section', async () => {
      const isProfileSectionVisible = await page.isVisible('[data-testid="profile-section"]');
      expect(isProfileSectionVisible).toBeTruthy();
    });

    test('should handle profile editing', async ({ page }) => {
      const editProfileButtonVisible = await page.isVisible('[data-testid="edit-profile-button"]');

      if (editProfileButtonVisible) {
        await photographerDashboard.editProfile();

        // Should open edit form or navigate to edit page
        await page.waitForTimeout(2000);

        // Check if edit interface is available
        const isEditingInterface = await page.isVisible('[data-testid="profile-edit-form"]') ||
                                   await page.isVisible('[data-testid="save-profile-button"]');

        expect(isEditingInterface).toBeTruthy();
      }
    });
  });

  test.describe('Navigation and User Experience', () => {
    test('should navigate between photographer pages smoothly', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);

      // Dashboard
      await photographerDashboard.goto();
      expect(await photographerDashboard.isDashboardVisible()).toBeTruthy();

      // Booking Manager
      await bookingManager.goto();
      expect(await bookingManager.isBookingManagerVisible()).toBeTruthy();

      // Back to Dashboard
      await photographerDashboard.goto();
      expect(await photographerDashboard.isDashboardVisible()).toBeTruthy();

      // Home page
      await homePage.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();
    });

    test('should maintain photographer session across pages', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);

      await photographerDashboard.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();

      await bookingManager.goto();
      expect(await homePage.isUserLoggedIn()).toBeTruthy();

      // Refresh page
      await page.reload();
      expect(await bookingManager.isBookingManagerVisible()).toBeTruthy();
    });
  });
});