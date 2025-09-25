import { chromium } from '@playwright/test';
import { TestHelpers } from './test-helpers.js';

async function globalSetup() {
  console.log('Starting E2E test setup...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for backend to be ready
    console.log('Waiting for backend to be ready...');
    let backendReady = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!backendReady && attempts < maxAttempts) {
      try {
        const response = await page.request.get('http://localhost:5002/health');
        if (response.ok()) {
          backendReady = true;
          console.log('Backend is ready');
        }
      } catch (error) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!backendReady) {
      throw new Error('Backend is not ready after 30 seconds');
    }

    // Wait for frontend to be ready
    console.log('Waiting for frontend to be ready...');
    let frontendReady = false;
    attempts = 0;

    while (!frontendReady && attempts < maxAttempts) {
      try {
        const response = await page.request.get('http://localhost:5173');
        if (response.ok()) {
          frontendReady = true;
          console.log('Frontend is ready');
        }
      } catch (error) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!frontendReady) {
      throw new Error('Frontend is not ready after 30 seconds');
    }

    // Setup test database and seed data
    const testHelpers = new TestHelpers(page, page.request);

    console.log('Setting up test users...');
    await testHelpers.createTestUsers();

    console.log('E2E test setup completed successfully');

  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;