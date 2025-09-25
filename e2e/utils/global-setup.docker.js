import { chromium } from '@playwright/test';
import { TestHelpers } from './test-helpers.js';

async function globalSetup() {
  console.log('Starting E2E test setup for Docker environment...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for backend to be ready (Docker backend on port 5002)
    console.log('Waiting for Docker backend to be ready...');
    let backendReady = false;
    let attempts = 0;
    const maxAttempts = 60; // Increased for Docker startup time

    while (!backendReady && attempts < maxAttempts) {
      try {
        const response = await page.request.get('http://localhost:5002/health');
        if (response.ok()) {
          backendReady = true;
          console.log('Docker backend is ready');
        }
      } catch (error) {
        attempts++;
        console.log(`Backend attempt ${attempts}/${maxAttempts}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Longer wait for Docker
      }
    }

    if (!backendReady) {
      throw new Error('Docker backend is not ready after 2 minutes');
    }

    // Wait for frontend to be ready (Docker frontend on port 3000)
    console.log('Waiting for Docker frontend to be ready...');
    let frontendReady = false;
    attempts = 0;

    while (!frontendReady && attempts < maxAttempts) {
      try {
        const response = await page.request.get('http://localhost:3000');
        if (response.ok()) {
          frontendReady = true;
          console.log('Docker frontend is ready');
        }
      } catch (error) {
        attempts++;
        console.log(`Frontend attempt ${attempts}/${maxAttempts}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!frontendReady) {
      throw new Error('Docker frontend is not ready after 2 minutes');
    }

    // Setup test database and seed data
    const testHelpers = new TestHelpers(page, page.request);

    console.log('Setting up test users...');
    await testHelpers.createTestUsers();

    console.log('Docker E2E test setup completed successfully');

  } catch (error) {
    console.error('Docker global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;