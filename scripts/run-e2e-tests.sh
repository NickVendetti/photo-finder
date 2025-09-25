#!/bin/bash

# Photo Finder E2E Test Runner Script
# This script sets up and runs E2E tests locally

set -e

echo "🚀 Setting up Photo Finder E2E Tests"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi

    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client not found. Make sure PostgreSQL is available."
    fi

    print_success "Prerequisites check completed"
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."

    # Create .env.e2e if it doesn't exist
    if [ ! -f ".env.e2e" ]; then
        print_status "Creating .env.e2e file..."
        cat > .env.e2e << EOF
# E2E Testing Environment Configuration
NODE_ENV=test
VITE_API_BASE_URL=http://localhost:5002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/photography_e2e_db
JWT_SECRET=e2e_test_secret
JWT_EXPIRES_IN=7d

# Test user credentials
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=testpass123
TEST_PHOTOGRAPHER_EMAIL=testphotographer@example.com
TEST_PHOTOGRAPHER_PASSWORD=testpass123

# Test database configuration
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=photography_e2e_db
TEST_DB_USER=postgres
TEST_DB_PASSWORD=postgres
EOF
    fi

    print_success "Environment setup completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."

    # Install root dependencies
    npm ci

    # Install frontend dependencies
    cd frontend && npm ci
    cd ..

    # Install backend dependencies
    cd backend && npm ci
    cd ..

    # Install Playwright browsers
    npx playwright install

    print_success "Dependencies installed"
}

# Setup database
setup_database() {
    print_status "Setting up test database..."

    # Check if database exists
    DB_EXISTS=$(psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw photography_e2e_db && echo "yes" || echo "no")

    if [ "$DB_EXISTS" = "no" ]; then
        print_status "Creating test database..."
        createdb -h localhost -U postgres photography_e2e_db
    fi

    # Run migrations
    cd backend
    export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/photography_e2e_db"
    npx prisma generate
    npx prisma migrate deploy
    npx prisma db seed
    cd ..

    print_success "Database setup completed"
}

# Start services
start_services() {
    print_status "Starting application services..."

    # Kill any existing processes on the ports
    lsof -ti:5002 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true

    # Start backend
    cd backend
    export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/photography_e2e_db"
    export NODE_ENV=development
    export PORT=5002
    npm start &
    BACKEND_PID=$!
    cd ..

    # Start frontend
    cd frontend
    export VITE_API_BASE_URL=http://localhost:5002
    npm run dev &
    FRONTEND_PID=$!
    cd ..

    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 10

    # Check if services are running
    if curl -s http://localhost:5002/health > /dev/null 2>&1; then
        print_success "Backend is running on port 5002"
    else
        print_warning "Backend may not be ready yet"
    fi

    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        print_success "Frontend is running on port 5173"
    else
        print_warning "Frontend may not be ready yet"
    fi
}

# Run tests
run_tests() {
    print_status "Running E2E tests..."

    # Set test mode based on argument
    TEST_MODE=${1:-""}

    case $TEST_MODE in
        "headed")
            npx playwright test --headed
            ;;
        "debug")
            npx playwright test --debug
            ;;
        "ui")
            npx playwright test --ui
            ;;
        "specific")
            if [ -z "$2" ]; then
                print_error "Please specify a test file"
                exit 1
            fi
            npx playwright test "$2"
            ;;
        *)
            npx playwright test
            ;;
    esac

    print_success "Tests completed"
}

# Cleanup
cleanup() {
    print_status "Cleaning up..."

    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi

    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi

    # Kill any remaining processes on the ports
    lsof -ti:5002 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true

    print_success "Cleanup completed"
}

# Trap cleanup on script exit
trap cleanup EXIT

# Show help
show_help() {
    echo "Photo Finder E2E Test Runner"
    echo ""
    echo "Usage: $0 [OPTIONS] [TEST_MODE] [TEST_FILE]"
    echo ""
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --setup-only        Only setup environment and dependencies"
    echo "  --no-setup         Skip setup steps"
    echo ""
    echo "Test Modes:"
    echo "  (no mode)          Run tests in headless mode"
    echo "  headed             Run tests with visible browser"
    echo "  debug              Run tests in debug mode"
    echo "  ui                 Run tests with Playwright UI"
    echo "  specific <file>    Run specific test file"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run all tests"
    echo "  $0 headed                             # Run with visible browser"
    echo "  $0 debug                              # Run in debug mode"
    echo "  $0 specific e2e/tests/auth.spec.js   # Run specific test"
    echo "  $0 --setup-only                      # Only setup environment"
}

# Parse arguments
SETUP_ONLY=false
NO_SETUP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_help
            exit 0
            ;;
        --setup-only)
            SETUP_ONLY=true
            shift
            ;;
        --no-setup)
            NO_SETUP=true
            shift
            ;;
        *)
            TEST_ARGS="$@"
            break
            ;;
    esac
done

# Main execution
main() {
    print_status "Starting Photo Finder E2E Test Runner"

    if [ "$NO_SETUP" = false ]; then
        check_prerequisites
        setup_environment
        install_dependencies
        setup_database
        start_services
    fi

    if [ "$SETUP_ONLY" = true ]; then
        print_success "Setup completed. Services are running."
        print_status "Frontend: http://localhost:5173"
        print_status "Backend: http://localhost:5002"
        print_status "Run 'npx playwright test' to execute tests"
        exit 0
    fi

    run_tests $TEST_ARGS

    print_success "🎉 E2E test run completed!"
}

# Run main function
main "$@"