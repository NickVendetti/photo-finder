# Photo Finder - E2E Testing Setup

This project includes comprehensive end-to-end testing using Playwright to ensure all functionality works correctly across different browsers and devices.

## Playwright Setup Instructions

### 1. Install Playwright Dependencies

First, install Playwright package and dependencies in the e2e directory:

```bash
# Install Playwright package and dependencies (run from project root)
npm run e2e:setup

# Or manually install from e2e directory:
cd e2e
npm install
npm run e2e:install
npm run e2e:install-deps
```

### 2. Running Tests

#### Basic Test Commands
```bash
# Run all tests (headless) - commands run from project root
npm run e2e

# Run tests with browser UI visible (great for demos!)
npm run e2e:headed
npm run demo

# Open Playwright UI for interactive testing
npm run e2e:ui
npm run demo:ui

# Debug tests step by step
npm run e2e:debug
```

#### Browser-Specific Tests
```bash
# Run tests in specific browsers
npm run e2e:chromium
npm run e2e:firefox
npm run e2e:webkit

# Run mobile device tests
npm run e2e:mobile    # Mobile Chrome (Pixel 5)
npm run e2e:safari    # Mobile Safari (iPhone 12)
```

#### Test Reports and Code Generation
```bash
# View HTML test report
npm run e2e:report

# Generate test code by recording interactions
npm run e2e:codegen
```

### 3. Test Structure

Our e2e tests are located in the `e2e/tests/` directory:

- `auth.spec.js` - Authentication flows (login, register, logout)
- `user-journey.spec.js` - Complete user workflows
- `photographer-journey.spec.js` - Photographer-specific workflows
- `booking.spec.js` - Booking and scheduling functionality
- `photos.spec.js` - Photo upload and gallery features
- `basic.spec.js` - Basic app functionality and navigation

### 4. Configuration

The Playwright configuration is located in `e2e/playwright.config.js` and includes:

- **Multi-browser support**: Chrome, Firefox, Safari, Mobile devices
- **Automatic server startup**: Frontend (port 5173) and Backend (port 5002)
- **Test artifacts**: Screenshots, videos, and traces on failure
- **HTML reports**: Generated in `e2e/e2e-results/html-report/`
- **Organized structure**: All e2e-related files are contained in the `e2e/` directory

### 5. Demo Mode for Presentations

Perfect for showing off automated browser interactions:

```bash
# Run tests with visible browser (headed mode) - single Chrome window
npm run demo

# Open interactive UI for step-by-step execution
npm run demo:ui
```

The `npm run demo` command runs tests in headed mode with:
- Only Chromium browser (prevents multiple browser windows)
- Single worker (prevents parallel execution chaos)
- Visible browser window for demonstrations

This makes it perfect for showing how Playwright automates real browser interactions without overwhelming your screen with multiple windows!

## Development Commands

```bash
# Frontend development server
cd frontend && npm run dev

# Backend development server
cd backend && npm start

# Run both with Docker
docker-compose up --build
```