# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Photo Finder is a full-stack photography booking platform with a React frontend, Node.js/Express backend, and PostgreSQL database. The application connects photographers with clients, enabling portfolio browsing, booking management, and photo sharing.

## Architecture

### Monorepo Structure
- `frontend/` - React application (Vite + Tailwind CSS)
- `backend/` - Express.js API server with Prisma ORM
- `nginx/` - Nginx configuration for production
- `docker-compose.yml` - Multi-container deployment setup

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Vitest
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, JWT authentication
- **Database**: PostgreSQL with Prisma schema
- **Deployment**: Docker, Nginx reverse proxy

### Database Schema
Key models in `backend/prisma/schema.prisma`:
- **User**: Supports two user types (USER, PHOTOGRAPHER) with role-based access
- **Photo**: Stores image data (base64), linked to users, supports user uploads and Flickr integration
- **Booking**: Handles photography session scheduling between users and photographers

### Authentication & Authorization
- JWT-based authentication with role-based access control
- Two user types: regular users (can book sessions) and photographers (can manage portfolios)
- Protected routes based on user roles

## Development Commands

### Frontend (`frontend/`)
```bash
npm run dev          # Start development server (port 5173)
npm run build        # Production build
npm run lint         # ESLint code linting
npm run test         # Run Vitest tests
npm run test:ui      # Run tests with UI
npm run coverage     # Generate test coverage report
npm run preview      # Preview production build
```

### Backend (`backend/`)
```bash
npm start                    # Start production server
npm run prisma:setup        # Run migrations and seed database (first-time setup)
npm run prisma:migrate       # Run database migrations
npm run prisma:seed          # Seed database with initial data
npm run prisma:reset         # Reset database (destructive)
npm test                     # Run Jest tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate test coverage report
```

### Docker Development
```bash
docker-compose up --build    # Build and start all services
docker-compose down          # Stop all services
```

## Environment Setup

### Frontend Environment (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:5002  # Backend API URL
```

### Backend Environment (`backend/.env`)
```
PORT=5002
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/photography_db"
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## Key Integrations

### External APIs
- **Flickr API**: Public photo discovery and browsing
- **Cloudinary**: User photo uploads and storage (legacy, now using base64 storage)

### Database Operations
- Prisma CLI commands for schema management
- Seeded data includes sample users and photos
- Migration-first database schema evolution

## Deployment Architecture

Production deployment uses Docker Compose with:
- Frontend: Nginx-served static build
- Backend: Node.js API server
- Database: PostgreSQL container
- Reverse proxy: Nginx for routing and SSL

The application is configured for deployment at `photobook.kilometers.ai` with proper CORS and environment-specific API URLs.