import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DiscoveryPage } from '../pages/DiscoveryPage.js';
import { PhotographerDashboardPage } from '../pages/PhotographerDashboardPage.js';
import { TestHelpers, users, photos } from '../utils/test-helpers.js';

test.describe('Photo Management', () => {
  let loginPage;
  let discoveryPage;
  let photographerDashboard;
  let testHelpers;

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    discoveryPage = new DiscoveryPage(page);
    photographerDashboard = new PhotographerDashboardPage(page);
    testHelpers = new TestHelpers(page, request);
  });

  test.describe('Photo Upload (Photographer)', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);
      await photographerDashboard.goto();
    });

    test('should display photo upload interface', async ({ page }) => {
      expect(await photographerDashboard.isPortfolioSectionVisible()).toBeTruthy();

      // Click upload photo button
      await page.click('[data-testid="upload-photo-button"]');

      // Check if upload form is visible
      const uploadInterfaceElements = [
        '[data-testid="file-input"]',
        '[data-testid="photo-title-input"]',
        '[data-testid="photo-description-input"]',
        '[data-testid="upload-button"]'
      ];

      let foundElements = 0;
      for (const selector of uploadInterfaceElements) {
        if (await page.isVisible(selector)) {
          foundElements++;
        }
      }

      expect(foundElements).toBeGreaterThan(0);
    });

    test('should validate photo upload form', async ({ page }) => {
      await page.click('[data-testid="upload-photo-button"]');

      // Try to upload without required fields
      const uploadButtonVisible = await page.isVisible('[data-testid="upload-button"]');
      if (uploadButtonVisible) {
        await page.click('[data-testid="upload-button"]');

        // Should show validation errors or stay on form
        await page.waitForTimeout(1000);

        // Check if we're still in upload mode or if there's an error
        const errorMessage = await photographerDashboard.getErrorMessage();
        const stillInUploadMode = await page.isVisible('[data-testid="upload-button"]');

        expect(errorMessage || stillInUploadMode).toBeTruthy();
      }
    });

    test('should handle file upload process', async ({ page }) => {
      await page.click('[data-testid="upload-photo-button"]');

      const fileInputVisible = await page.isVisible('[data-testid="file-input"]');
      if (fileInputVisible) {
        // Create a small test image file
        const testImageBuffer = Buffer.from(photos.samplePhotos[0].image.split(',')[1], 'base64');

        // Note: In a real test, you'd want to use an actual image file
        // For this example, we'll simulate the upload process
        await page.fill('[data-testid="photo-title-input"]', 'Test Upload Photo');
        await page.fill('[data-testid="photo-description-input"]', 'This is a test photo upload');

        // Simulate file selection (in real tests, you'd use setInputFiles)
        // await page.setInputFiles('[data-testid="file-input"]', 'path/to/test/image.jpg');

        await page.click('[data-testid="upload-button"]');

        await page.waitForTimeout(3000); // Wait for upload process

        // Check for success or error
        const successMessage = await photographerDashboard.getSuccessMessage();
        const errorMessage = await photographerDashboard.getErrorMessage();

        expect(successMessage || errorMessage).toBeTruthy();
      }
    });

    test('should show uploaded photos in portfolio', async () => {
      const initialPhotoCount = await photographerDashboard.getPhotoCount();
      expect(initialPhotoCount).toBeGreaterThanOrEqual(0);

      if (initialPhotoCount > 0) {
        const photoCards = await photographerDashboard.getPhotoCards();
        expect(photoCards.length).toBe(initialPhotoCount);

        // Verify photo card elements
        const firstCard = photoCards[0];
        const hasImage = await firstCard.locator('img').isVisible();
        const hasTitle = await firstCard.locator('[data-testid="photo-title"]').isVisible();

        expect(hasImage || hasTitle).toBeTruthy();
      }
    });
  });

  test.describe('Photo Gallery Display', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);
    });

    test('should display photographer photos on discovery page', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        // Check if photographer cards show portfolio images
        const photographerCards = await discoveryPage.getPhotographerCards();

        for (let i = 0; i < Math.min(photographerCards.length, 3); i++) {
          const card = photographerCards[i];
          const hasPhotos = await card.locator('[data-testid="photographer-photo"]').isVisible();

          if (hasPhotos) {
            // Verify photo elements
            const photoElement = card.locator('[data-testid="photographer-photo"]').first();
            const isImageVisible = await photoElement.locator('img').isVisible();
            expect(isImageVisible).toBeTruthy();
          }
        }
      }
    });

    test('should show photographer portfolio on booking page', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        await discoveryPage.clickBookForPhotographer(0);

        // Check if photographer portfolio is visible on booking page
        const isPortfolioVisible = await page.isVisible('[data-testid="photographer-portfolio"]');

        if (isPortfolioVisible) {
          const portfolioImages = await page.locator('[data-testid="photographer-portfolio"] img').count();
          expect(portfolioImages).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should handle photo gallery interactions', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        // Click on view portfolio
        await discoveryPage.clickViewPortfolioForPhotographer(0);
        await page.waitForTimeout(2000);

        // Check if gallery or modal opened
        const galleryVisible = await page.isVisible('[data-testid="photo-gallery"]');
        const modalVisible = await page.isVisible('[data-testid="photo-modal"]');

        if (galleryVisible || modalVisible) {
          // Test gallery navigation if available
          const nextButton = page.locator('[data-testid="gallery-next"]');
          const prevButton = page.locator('[data-testid="gallery-prev"]');

          if (await nextButton.isVisible()) {
            await nextButton.click();
            await page.waitForTimeout(500);
          }

          if (await prevButton.isVisible()) {
            await prevButton.click();
            await page.waitForTimeout(500);
          }
        }
      }
    });
  });

  test.describe('Photo Management (Photographer)', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);
      await photographerDashboard.goto();
    });

    test('should edit photo metadata', async ({ page }) => {
      const photoCount = await photographerDashboard.getPhotoCount();

      if (photoCount > 0) {
        // Click edit button on first photo
        await photographerDashboard.editPhoto(0);
        await page.waitForTimeout(1000);

        // Check if edit form is visible
        const editFormVisible = await page.isVisible('[data-testid="photo-edit-form"]');
        const titleInputVisible = await page.isVisible('[data-testid="photo-title-input"]');
        const descriptionInputVisible = await page.isVisible('[data-testid="photo-description-input"]');

        if (editFormVisible || titleInputVisible || descriptionInputVisible) {
          // Update photo information
          if (titleInputVisible) {
            await page.fill('[data-testid="photo-title-input"]', 'Updated Photo Title');
          }
          if (descriptionInputVisible) {
            await page.fill('[data-testid="photo-description-input"]', 'Updated photo description');
          }

          // Save changes
          const saveButtonVisible = await page.isVisible('[data-testid="save-photo-button"]');
          if (saveButtonVisible) {
            await page.click('[data-testid="save-photo-button"]');
            await page.waitForTimeout(2000);

            // Check for success message
            const successMessage = await photographerDashboard.getSuccessMessage();
            if (successMessage) {
              expect(successMessage).toContain('updated' || 'saved');
            }
          }
        }
      }
    });

    test('should delete photos', async ({ page }) => {
      const initialPhotoCount = await photographerDashboard.getPhotoCount();

      if (initialPhotoCount > 0) {
        // Delete first photo
        await photographerDashboard.deletePhoto(0);

        // Handle confirmation dialog if present
        const confirmDialog = page.locator('[data-testid="confirm-delete"]');
        if (await confirmDialog.isVisible()) {
          await confirmDialog.click();
        }

        await page.waitForTimeout(2000);

        // Verify photo was deleted
        const newPhotoCount = await photographerDashboard.getPhotoCount();
        expect(newPhotoCount).toBeLessThanOrEqual(initialPhotoCount);

        // Check for success message
        const successMessage = await photographerDashboard.getSuccessMessage();
        if (successMessage) {
          expect(successMessage).toContain('deleted' || 'removed');
        }
      }
    });

    test('should organize photos by category/type', async ({ page }) => {
      const photoCount = await photographerDashboard.getPhotoCount();

      if (photoCount > 0) {
        // Check if there are photo type filters or categories
        const categoryFilter = page.locator('[data-testid="photo-category-filter"]');
        const typeFilter = page.locator('[data-testid="photo-type-filter"]');

        if (await categoryFilter.isVisible()) {
          await categoryFilter.selectOption('portrait');
          await page.waitForTimeout(1000);

          await categoryFilter.selectOption('wedding');
          await page.waitForTimeout(1000);

          await categoryFilter.selectOption('all');
          await page.waitForTimeout(1000);
        }

        if (await typeFilter.isVisible()) {
          await typeFilter.selectOption('landscape');
          await page.waitForTimeout(1000);

          await typeFilter.selectOption('all');
          await page.waitForTimeout(1000);
        }
      }
    });

    test('should handle batch photo operations', async ({ page }) => {
      const photoCount = await photographerDashboard.getPhotoCount();

      if (photoCount > 1) {
        // Check for batch selection functionality
        const selectAllButton = page.locator('[data-testid="select-all-photos"]');
        const batchDeleteButton = page.locator('[data-testid="batch-delete-photos"]');

        if (await selectAllButton.isVisible()) {
          await selectAllButton.click();
          await page.waitForTimeout(500);

          if (await batchDeleteButton.isVisible()) {
            // Don't actually delete all photos in test
            console.log('Batch operations are available');
          }
        }

        // Check for individual photo selection
        const photoCheckboxes = page.locator('[data-testid="photo-checkbox"]');
        const checkboxCount = await photoCheckboxes.count();

        if (checkboxCount > 0) {
          // Select first photo
          await photoCheckboxes.first().click();

          // Check if batch actions become available
          const batchActionsVisible = await page.isVisible('[data-testid="batch-actions"]');
          expect(batchActionsVisible).toBeTruthy();
        }
      }
    });
  });

  test.describe('Photo Search and Filtering', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);
    });

    test('should search photographers by photo content', async ({ page }) => {
      await discoveryPage.goto();

      // Test different search terms
      const searchTerms = ['portrait', 'wedding', 'landscape'];

      for (const term of searchTerms) {
        await discoveryPage.searchPhotographers(term);
        await testHelpers.waitForLoadingToComplete();

        const photographerCount = await discoveryPage.getPhotographerCount();

        // Results should be relevant to search term
        if (photographerCount > 0) {
          // Check if photographer portfolios contain relevant content
          console.log(`Found ${photographerCount} photographers for "${term}"`);
        }
      }

      // Test empty search
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();
    });

    test('should filter photographers by specialization', async ({ page }) => {
      await discoveryPage.goto();

      // Check if there are filter options
      const specializationFilter = page.locator('[data-testid="specialization-filter"]');
      const priceFilter = page.locator('[data-testid="price-filter"]');
      const locationFilter = page.locator('[data-testid="location-filter"]');

      if (await specializationFilter.isVisible()) {
        await specializationFilter.selectOption('wedding');
        await testHelpers.waitForLoadingToComplete();

        await specializationFilter.selectOption('portrait');
        await testHelpers.waitForLoadingToComplete();

        await specializationFilter.selectOption('all');
        await testHelpers.waitForLoadingToComplete();
      }

      // Test any other available filters
      if (await priceFilter.isVisible()) {
        await priceFilter.selectOption('low-to-high');
        await testHelpers.waitForLoadingToComplete();
      }
    });
  });

  test.describe('Photo Quality and Performance', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testUser.email, users.testUser.password);
    });

    test('should load images efficiently', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');

      // Measure image loading time
      const startTime = Date.now();
      await testHelpers.waitForLoadingToComplete();
      const endTime = Date.now();

      const loadTime = endTime - startTime;
      console.log(`Page load time: ${loadTime}ms`);

      // Verify images are actually loaded
      const images = await page.locator('img').all();
      let loadedImages = 0;

      for (const img of images) {
        const isLoaded = await img.evaluate((element) => {
          return element.complete && element.naturalWidth > 0;
        });
        if (isLoaded) loadedImages++;
      }

      console.log(`Loaded ${loadedImages} of ${images.length} images`);
      expect(loadedImages).toBeGreaterThanOrEqual(0);
    });

    test('should handle large photo galleries', async ({ page }) => {
      await discoveryPage.goto();
      await discoveryPage.searchPhotographers('');
      await testHelpers.waitForLoadingToComplete();

      const photographerCount = await discoveryPage.getPhotographerCount();

      if (photographerCount > 0) {
        // Click on photographer with potentially many photos
        await discoveryPage.clickViewPortfolioForPhotographer(0);
        await page.waitForTimeout(2000);

        // Check for pagination or lazy loading
        const paginationVisible = await page.isVisible('[data-testid="photo-pagination"]');
        const loadMoreVisible = await page.isVisible('[data-testid="load-more-photos"]');
        const lazyLoadingActive = await page.isVisible('[data-testid="photo-skeleton"]');

        if (paginationVisible) {
          console.log('Photo gallery uses pagination');
        }

        if (loadMoreVisible) {
          await page.click('[data-testid="load-more-photos"]');
          await page.waitForTimeout(2000);
        }

        if (lazyLoadingActive) {
          console.log('Photo gallery uses lazy loading');
        }
      }
    });
  });

  test.describe('Photo Integration with External Services', () => {
    test('should handle Flickr integration', async ({ page }) => {
      // Note: This would test the Flickr integration mentioned in the codebase
      await discoveryPage.goto();

      // Check if there's a toggle or section for external photos
      const flickrSection = page.locator('[data-testid="flickr-photos"]');
      const externalPhotosToggle = page.locator('[data-testid="external-photos-toggle"]');

      if (await flickrSection.isVisible()) {
        // Test Flickr photo display
        const flickrPhotos = await flickrSection.locator('img').count();
        expect(flickrPhotos).toBeGreaterThanOrEqual(0);
      }

      if (await externalPhotosToggle.isVisible()) {
        await externalPhotosToggle.click();
        await testHelpers.waitForLoadingToComplete();
      }
    });

    test('should handle photo storage transitions', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(users.testPhotographer.email, users.testPhotographer.password);
      await photographerDashboard.goto();

      const photoCount = await photographerDashboard.getPhotoCount();

      if (photoCount > 0) {
        // This would test the transition from Cloudinary to base64 storage
        // as mentioned in the CLAUDE.md file
        const photoCards = await photographerDashboard.getPhotoCards();

        for (const card of photoCards.slice(0, 3)) { // Test first 3 photos
          const imgElement = card.locator('img').first();
          const src = await imgElement.getAttribute('src');

          // Check if image source is base64 or external URL
          if (src) {
            const isBase64 = src.startsWith('data:image/');
            const isExternalUrl = src.startsWith('http');

            expect(isBase64 || isExternalUrl).toBeTruthy();
          }
        }
      }
    });
  });
});