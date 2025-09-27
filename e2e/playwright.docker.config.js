import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
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
    baseURL: 'http://localhost:3000',  // Docker frontend port
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
  ],

  // Don't start servers - assume Docker containers are already running
  // webServer: [],

  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  globalSetup: './utils/global-setup.docker.js',
  globalTeardown: './utils/global-teardown.js',
});