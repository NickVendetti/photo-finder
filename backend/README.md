# Photography Booking API

A RESTful API for a photography booking platform built with Express.js and Prisma ORM. This backend service provides endpoints for user management, photo uploads (stored in db as base64), and booking functionality.

## Features

- User authentication and authorization
- Photo management
- Booking system
- Health check endpoint
- Environment-based configuration
- Prisma ORM for database interactions

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [API Routes](#api-routes)
- [Database](#database)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Dependencies](#dependencies)
- [Development Dependencies](#development-dependencies)

## Requirements

- Node.js (v14.x or higher)
- npm
- PostgreSQL (or your preferred database supported by Prisma)

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (see [Environment Setup](#environment-setup))

4. Set up Prisma database and seed it with initial data
```bash
npm run prisma:setup
```

This will run the migration and seed the database with initial data.

## Environment Setup

Create the following environment files in the root directory:

### `.env` (Development)

```
# Server settings
PORT=5002
NODE_ENV=development

# Database settings
DATABASE_URL="postgresql://username:password@localhost:5432/photography_db"

# JWT settings
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Other settings
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=50mb
```

### `.env.test` (Testing)

```
# Server settings
PORT=5002
NODE_ENV=test

# Test database settings (use a separate test database)
DATABASE_URL="postgresql://username:password@localhost:5432/photography_test_db"

# JWT settings
JWT_SECRET=your_test_jwt_secret
JWT_EXPIRES_IN=7d

# Other settings
UPLOAD_PATH=./test_uploads
MAX_FILE_SIZE=50mb
```

## API Routes

The server exposes the following API endpoints:

- **Authentication**
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration

- **Users**
  - `GET /users` - Get all users
  - `GET /users/:id` - Get user by ID
  - `PUT /users/:id` - Update user
  - `DELETE /users/:id` - Delete user

- **Photos**
  - `GET /photos` - Get all photos
  - `GET /photos/:id` - Get photo by ID
  - `POST /photos` - Upload a new photo
  - `PUT /photos/:id` - Update photo details
  - `DELETE /photos/:id` - Delete photo

- **Bookings**
  - `GET /bookings` - Get all bookings
  - `GET /bookings/:id` - Get booking by ID
  - `POST /bookings` - Create a new booking
  - `PUT /bookings/:id` - Update booking
  - `DELETE /bookings/:id` - Cancel booking

- **Health Check**
  - `GET /health` - Check server and database health

## Database

This project uses Prisma ORM to interact with the database. The database schema is defined in `prisma/schema.prisma`.

### Database Seeding

Initial data is provided through the seed script located at `prisma/seed.js`. This script is automatically run when executing `npm run prisma:seed` or as part of `npm run prisma:setup`.

The seed configuration is defined in the `package.json`:

```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

### Common Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Create a migration
npx prisma migrate dev --name <migration-name>

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (UI for exploring and manipulating data)
npx prisma studio

# Run the seed script
npx prisma db seed
```

## Available Scripts

The project includes several npm scripts to help with development and testing:

```bash
# Start the server in production mode
npm start

# Prisma database operations
npm run prisma:migrate     # Run migrations (use --name=migration_name to specify)
npm run prisma:seed        # Seed the database with initial data
npm run prisma:reset       # Reset the database (caution: deletes all data)
npm run prisma:setup       # Run migrations and seed the database

# Testing
npm test                   # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate test coverage report
npm run test:debug         # Debug tests
```

The server will start on the port specified in your environment variables (default: 5002).

## Testing

The project uses Jest for testing. Tests are configured to run with the test environment variables from `.env.test`.

```bash
# Run all tests
npm test

# Run tests in watch mode for development
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Debug tests
npm run test:debug
```

The test setup uses `cross-env` to ensure the test environment is properly set across different operating systems.

## Error Handling

The API returns standard HTTP status codes:

- `200 OK` - The request has succeeded
- `201 Created` - A new resource has been created
- `400 Bad Request` - The server could not understand the request
- `401 Unauthorized` - Authentication is required
- `403 Forbidden` - The client does not have access rights
- `404 Not Found` - The server can't find the requested resource
- `500 Internal Server Error` - The server has encountered a situation it doesn't know how to handle

## Dependencies

### Main Dependencies

- **@prisma/client**: Prisma ORM client for database access
- **axios**: HTTP client for making requests
- **bcryptjs**: Library for hashing passwords
- **body-parser**: Middleware for parsing request bodies
- **cors**: Middleware for enabling CORS
- **dotenv**: For loading environment variables
- **express**: Web framework for Node.js
- **jsonwebtoken**: For implementing JWT authentication
- **mongoose**: MongoDB object modeling tool

### Development Dependencies

- **@babel/preset-env**: Babel preset for each environment
- **@types/jest**: TypeScript definitions for Jest
- **cross-env**: Run scripts with environment variables across platforms
- **jest**: Testing framework
- **nodemon**: Utility for automatically restarting node applications
- **prisma**: Prisma CLI and ORM
- **supertest**: Library for testing HTTP servers

