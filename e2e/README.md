# End-to-End Testing for Photo Finder

This directory contains comprehensive end-to-end (E2E) tests for the Photo Finder application using Playwright.

## Overview

The E2E test suite covers all major user flows and functionality:
- Authentication (registration, login, logout)
- User journey (discovery, booking)
- Photographer workflow (portfolio management, booking handling)
- Photo management and display
- Cross-browser compatibility
- Responsive design

## Test Architecture

### Page Object Model
Tests use the Page Object Model pattern for maintainability:
- `pages/` - Page object classes for each application page
- `utils/` - Test utilities and helpers
- `fixtures/` - Test data and fixtures
- `tests/` - Test specifications

### Test Structure
```
e2e/
├── pages/           # Page object classes
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── HomePage.js
│   ├── DiscoveryPage.js
│   ├── BookingPage.js
│   ├── PhotographerDashboardPage.js
│   └── BookingManagerPage.js
├── tests/           # Test specifications
│   ├── auth.spec.js
│   ├── user-journey.spec.js
│   ├── photographer-journey.spec.js
│   ├── booking.spec.js
│   └── photos.spec.js
├── fixtures/        # Test data
│   ├── users.json
│   ├── photos.json
│   └── bookings.json
└── utils/           # Test utilities
    ├── test-helpers.js
    ├── global-setup.js
    ├── global-teardown.js
    └── db-setup.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database running
- Photo Finder application (frontend and backend) set up

### Installation
1. Install dependencies:
   ```bash
   npm install
   npm run e2e:install
   ```

2. Set up environment variables:
   ```bash
   cp .env.e2e.example .env.e2e
   # Edit .env.e2e with your configuration
   ```

3. Set up test database:
   ```bash
   # Create E2E test database
   createdb photography_e2e_db

   # Run migrations
   cd backend && npx prisma migrate deploy
   ```

### Running Tests

#### Local Development
```bash
# Run all E2E tests
npm run e2e

# Run tests in headed mode (visible browser)
npm run e2e:headed

# Run tests in debug mode
npm run e2e:debug

# Run tests with UI (interactive mode)
npm run e2e:ui

# Run specific test file
npx playwright test e2e/tests/auth.spec.js

# Run tests in specific browser
npx playwright test --project=chromium
```

#### Viewing Reports
```bash
# Show HTML report
npm run e2e:report

# View last test results
npx playwright show-report
```

## Configuration

### Playwright Configuration (`playwright.config.js`)
- **Base URL**: `http://localhost:5173` (Vite dev server)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Timeouts**: 60s for tests, 10s for assertions
- **Retry**: 2 retries on CI, 0 locally
- **Reporters**: HTML, JSON, Line
- **Web Servers**: Automatically starts frontend and backend

### Environment Configuration (`.env.e2e`)
```env
NODE_ENV=test
VITE_API_BASE_URL=http://localhost:5002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/photography_e2e_db
JWT_SECRET=e2e_test_secret
JWT_EXPIRES_IN=7d
```

## Test Data

### Users
- `testUser`: Regular user for booking tests
- `testPhotographer`: Photographer for portfolio/booking management tests
- Additional users generated dynamically for specific tests

### Photos
- Sample photos with base64 encoded images
- Various photo types (portrait, wedding, landscape, event)
- Test metadata (titles, descriptions)

### Bookings
- Sample booking data for different photography types
- Future dates for valid booking tests
- Various time slots and booking types

## Test Categories

### Authentication Tests (`auth.spec.js`)
- User registration (USER and PHOTOGRAPHER types)
- Login/logout flows
- Protected route access
- Role-based access control
- Session management
- Token handling

### User Journey Tests (`user-journey.spec.js`)
- Complete registration to booking flow
- Photographer discovery and search
- Portfolio viewing
- Booking creation
- Error handling
- Responsive design

### Photographer Journey Tests (`photographer-journey.spec.js`)
- Photographer registration and setup
- Portfolio management
- Photo upload/edit/delete
- Booking request handling
- Dashboard functionality

### Booking Flow Tests (`booking.spec.js`)
- Booking creation process
- Form validation
- Different booking types
- Booking management (photographer side)
- Status workflows (pending → accepted/rejected)

### Photo Management Tests (`photos.spec.js`)
- Photo upload and display
- Portfolio gallery functionality
- Image optimization and loading
- Photo search and filtering
- External service integration (Flickr)

## CI/CD Integration

Tests run automatically on:
- Push to main branch
- Pull requests to main branch
- Manual workflow dispatch

### GitHub Actions Workflow
1. Sets up test environment with PostgreSQL
2. Installs dependencies and Playwright browsers
3. Configures test database and environment
4. Runs all E2E tests across multiple browsers
5. Uploads test artifacts and reports

### Test Artifacts
- HTML test reports
- Screenshots on failure
- Videos on failure
- Test results JSON

## Best Practices

### Writing Tests
1. Use Page Object Model for UI interactions
2. Use data-testid attributes for reliable selectors
3. Include proper waits and assertions
4. Test both happy path and error scenarios
5. Use descriptive test names and organize with describe blocks

### Test Data Management
1. Use fixtures for consistent test data
2. Generate unique data for registration tests
3. Clean up test data between test runs
4. Use isolated test database

### Debugging
1. Use `--headed` mode to see browser interactions
2. Use `--debug` mode for step-by-step debugging
3. Add screenshots for failed tests
4. Use browser developer tools in debug mode

### Performance
1. Run tests in parallel when possible
2. Use efficient selectors
3. Minimize unnecessary waits
4. Optimize test data setup

## Troubleshooting

### Common Issues

**Tests fail due to timing issues**
- Add appropriate waits for dynamic content
- Use `waitForLoadState('networkidle')` for API calls
- Increase timeouts if necessary

**Database connection errors**
- Ensure PostgreSQL is running
- Check DATABASE_URL configuration
- Verify test database exists

**Frontend/Backend not starting**
- Check if ports 5173 and 5002 are available
- Verify environment configuration
- Check application logs

**Browser installation issues**
- Run `npm run e2e:install-deps` for system dependencies
- Use `npx playwright install --force` to reinstall browsers

### Getting Help
1. Check test logs and screenshots in `e2e-results/`
2. Review HTML report for detailed test information
3. Use debug mode to step through failing tests
4. Check application logs for backend issues

## Maintenance

### Regular Tasks
1. Update test data as application evolves
2. Add new tests for new features
3. Update selectors if UI changes
4. Review and optimize slow tests
5. Update Playwright version regularly

### Adding New Tests
1. Create page objects for new pages/components
2. Add test data to fixtures if needed
3. Write comprehensive test cases
4. Update CI configuration if needed
5. Document new test scenarios

## Contributing

1. Follow existing patterns and conventions
2. Add proper test coverage for new features
3. Update documentation for significant changes
4. Ensure tests pass locally before submitting PR
5. Include meaningful test descriptions