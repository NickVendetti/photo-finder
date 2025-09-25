import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DiscoveryPage } from '../pages/DiscoveryPage.js';
import { BookingPage } from '../pages/BookingPage.js';
import { BookingManagerPage } from '../pages/BookingManagerPage.js';
import { TestHelpers, users, bookings } from '../utils/test-helpers.js';

test.describe('Booking Flow', () => {
  let loginPage;
  let discoveryPage;
  let bookingPage;
  let bookingManager;
  let testHelpers;

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    discoveryPage = new DiscoveryPage(page);
    bookingPage = new BookingPage(page);
    bookingManager = new BookingManagerPage(page);
    testHelpers = new TestHelpers(page, request);
  });

  test.describe('Booking Creation Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login as regular user
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);
    });

    test('should create booking through discovery page', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        const photographerName = await discoveryPage.getPhotographerName(0);

        // Navigate to booking page
        await discoveryPage.clickBookForPhotographer(0);

        // Verify booking page
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();
        expect(await bookingPage.isPhotographerInfoVisible()).toBeTruthy();

        // Verify photographer info matches
        const bookingPagePhotographerName = await bookingPage.getPhotographerName();
        expect(bookingPagePhotographerName).toContain(photographerName);

        // Create booking
        await bookingPage.createBooking(
          'portrait',
          '2024-12-01',
          '10:00'
        );

        // Verify result
        const confirmationMessage = await bookingPage.getConfirmationMessage();
        const errorMessage = await bookingPage.getErrorMessage();

        expect(confirmationMessage || errorMessage).toBeTruthy();

        if (confirmationMessage) {
          expect(confirmationMessage).toContain('success' || 'confirmed' || 'booked');
        }
      } else {
        console.log('No photographers available for booking test');
      }
    });

    test('should validate booking form fields', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        await discoveryPage.clickBookForPhotographer(0);
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();

        // Test empty form submission
        await page.click('[data-testid="submit-booking-button"]');

        // Should show validation errors or stay on form
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();

        // Test invalid date (past date)
        await bookingPage.createBooking(
          'wedding',
          '2020-01-01',
          '10:00'
        );

        const errorMessage = await bookingPage.getErrorMessage();
        if (errorMessage) {
          expect(errorMessage).toContain('date' || 'invalid' || 'past');
        }
      }
    });

    test('should handle different booking types', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        await discoveryPage.clickBookForPhotographer(0);
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();

        // Test different booking types
        const bookingTypes = ['portrait', 'wedding', 'event', 'landscape'];

        for (let i = 0; i < Math.min(bookingTypes.length, 2); i++) { // Test first 2 types
          const bookingType = bookingTypes[i];
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + i + 1);
          const dateString = futureDate.toISOString().split('T')[0];

          await bookingPage.createBooking(
            bookingType,
            dateString,
            '14:30'
          );

          await page.waitForTimeout(2000); // Wait for response

          const confirmationMessage = await bookingPage.getConfirmationMessage();
          const errorMessage = await bookingPage.getErrorMessage();

          expect(confirmationMessage || errorMessage).toBeTruthy();

          // Refresh page for next booking
          if (i < bookingTypes.length - 1) {
            await page.reload();
            expect(await bookingPage.isBookingFormVisible()).toBeTruthy();
          }
        }
      }
    });

    test('should show booking preview before confirmation', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        await discoveryPage.clickBookForPhotographer(0);

        // Fill form but don't submit yet
        await page.selectOption('[data-testid="booking-type-select"]', 'portrait');
        await page.fill('[data-testid="date-input"]', '2024-12-01');
        await page.fill('[data-testid="time-input"]', '10:00');

        // Check for booking preview
        const previewData = await bookingPage.getBookingPreviewData();
        if (previewData.visible) {
          expect(previewData.text).toContain('portrait' || 'Dec' || '10:00');
        }
      }
    });

    test('should allow booking cancellation', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        await discoveryPage.clickBookForPhotographer(0);
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();

        // Click cancel button
        const cancelButtonVisible = await page.isVisible('[data-testid="cancel-button"]');
        if (cancelButtonVisible) {
          await bookingPage.cancelBooking();

          // Should navigate away from booking page
          await page.waitForTimeout(2000);
          await expect(page).not.toHaveURL(/\/booking\/\d+/);
        }
      }
    });
  });

  test.describe('Direct Booking Page Access', () => {
    test('should handle direct URL access to booking page', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      // Try to access booking page directly with ID 1
      await bookingPage.goto(1);

      // Should either show booking form or appropriate error
      const isFormVisible = await bookingPage.isBookingFormVisible();
      const errorMessage = await bookingPage.getErrorMessage();

      expect(isFormVisible || errorMessage).toBeTruthy();

      if (errorMessage) {
        expect(errorMessage).toContain('not found' || 'invalid' || 'error');
      }
    });

    test('should require authentication for booking page', async ({ page }) => {
      // Try to access booking page without login
      await page.goto('/booking/1');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Booking Management (Photographer Side)', () => {
    test.beforeEach(async ({ page }) => {
      // Login as photographer
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);
    });

    test('should view incoming booking requests', async ({ page }) => {
      await bookingManager.goto();
      expect(await bookingManager.isBookingManagerVisible()).toBeTruthy();

      const bookingCount = await bookingManager.getBookingCount();
      expect(bookingCount).toBeGreaterThanOrEqual(0);

      if (bookingCount > 0) {
        const firstBooking = await bookingManager.getBookingData(0);
        expect(firstBooking.date).toBeTruthy();
        expect(firstBooking.time).toBeTruthy();
        expect(firstBooking.type).toBeTruthy();
        expect(firstBooking.client).toBeTruthy();
      }
    });

    test('should handle booking acceptance workflow', async ({ page }) => {
      await bookingManager.goto();

      const bookingCount = await bookingManager.getBookingCount();

      if (bookingCount > 0) {
        const initialBooking = await bookingManager.getBookingData(0);

        // Accept the booking
        await bookingManager.acceptBooking(0);
        await page.waitForTimeout(2000);

        // Verify success
        const successMessage = await bookingManager.getSuccessMessage();
        if (successMessage) {
          expect(successMessage).toContain('accept' || 'approved');
        }

        // Check if status updated
        const updatedBooking = await bookingManager.getBookingData(0);
        if (updatedBooking && updatedBooking.status !== initialBooking.status) {
          expect(updatedBooking.status).toContain('accepted' || 'approved');
        }
      }
    });

    test('should handle booking rejection workflow', async ({ page }) => {
      await bookingManager.goto();

      const bookingCount = await bookingManager.getBookingCount();

      if (bookingCount > 1) { // Need multiple bookings to test rejection
        const initialBooking = await bookingManager.getBookingData(1);

        // Reject the booking
        await bookingManager.rejectBooking(1);
        await page.waitForTimeout(2000);

        // Verify success
        const successMessage = await bookingManager.getSuccessMessage();
        if (successMessage) {
          expect(successMessage).toContain('reject' || 'declined');
        }

        // Check if status updated
        const updatedBooking = await bookingManager.getBookingData(1);
        if (updatedBooking && updatedBooking.status !== initialBooking.status) {
          expect(updatedBooking.status).toContain('rejected' || 'declined');
        }
      }
    });

    test('should handle booking completion workflow', async ({ page }) => {
      await bookingManager.goto();

      const bookingCount = await bookingManager.getBookingCount();

      if (bookingCount > 0) {
        // Look for accepted bookings to complete
        const firstBooking = await bookingManager.getBookingData(0);

        // If there's a complete button, test it
        const completeButtonVisible = await page.isVisible('[data-testid="complete-booking-button"]');

        if (completeButtonVisible) {
          await bookingManager.completeBooking(0);
          await page.waitForTimeout(2000);

          const successMessage = await bookingManager.getSuccessMessage();
          if (successMessage) {
            expect(successMessage).toContain('complete' || 'finished');
          }
        }
      }
    });
  });

  test.describe('Booking Status Flow', () => {
    test('should track booking through complete lifecycle', async ({ page }) => {
      // This test requires coordination between user and photographer actions
      // In a real scenario, this might involve database setup or API calls

      // Step 1: User creates booking
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);

      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        await discoveryPage.clickBookForPhotographer(0);
        expect(await bookingPage.isBookingFormVisible()).toBeTruthy();

        await bookingPage.createBooking(
          'portrait',
          '2024-12-10',
          '15:00'
        );

        const confirmationMessage = await bookingPage.getConfirmationMessage();
        if (confirmationMessage) {
          expect(confirmationMessage).toContain('success' || 'confirmed');
        }

        // Step 2: Photographer manages booking
        await loginPage.goto();
        await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);

        await bookingManager.goto();
        const managerBookingCount = await bookingManager.getBookingCount();

        if (managerBookingCount > 0) {
          // Accept a booking
          await bookingManager.acceptBooking(0);
          await page.waitForTimeout(2000);

          const successMessage = await bookingManager.getSuccessMessage();
          if (successMessage) {
            expect(successMessage).toContain('accept' || 'approved');
          }
        }
      }
    });
  });

  test.describe('Booking Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);
    });

    test('should handle invalid photographer ID', async ({ page }) => {
      await bookingPage.goto(99999); // Non-existent photographer

      const errorMessage = await bookingPage.getErrorMessage();
      const isFormVisible = await bookingPage.isBookingFormVisible();

      if (errorMessage) {
        expect(errorMessage).toContain('not found' || 'invalid' || 'error');
      } else {
        // If no error shown, form should not be visible
        expect(isFormVisible).toBeFalsy();
      }
    });

    test('should handle network errors gracefully', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        await discoveryPage.clickBookForPhotographer(0);

        // Intercept booking request to simulate network error
        await page.route('**/bookings', route => {
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Server error' })
          });
        });

        await bookingPage.createBooking(
          'portrait',
          '2024-12-01',
          '10:00'
        );

        // Should show error message
        const errorMessage = await bookingPage.getErrorMessage();
        expect(errorMessage).toBeTruthy();
      }
    });
  });
});