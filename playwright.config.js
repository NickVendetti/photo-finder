import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'e2e-results/html-report' }],
    ['json', { outputFile: 'e2e-results/test-results.json' }],
    ['line']
  ],
  outputDir: 'e2e-results/test-artifacts',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: [
    {
      command: 'cd frontend && npm run dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'cd backend && npm start',
      port: 5002,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    }
  ],

  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  globalSetup: './e2e/utils/global-setup.js',
  globalTeardown: './e2e/utils/global-teardown.js',
});