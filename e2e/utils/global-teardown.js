import { chromium } from '@playwright/test';

async function globalTeardown() {
  console.log('Starting E2E test teardown...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Clean up test data if needed
    console.log('Cleaning up test data...');

    // This is where you could call cleanup endpoints
    // or reset test database state

    console.log('E2E test teardown completed successfully');

  } catch (error) {
    console.error('Global teardown failed:', error);
    // Don't throw here as it might mask test failures
  } finally {
    await browser.close();
  }
}

export default globalTeardown;