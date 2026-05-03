# Photo Finder

A full stack platform for discovering and booking photographers. Browse portfolios by style and location, book sessions, and manage your photography business.

## Tech Stack

- **Frontend:** React · Vite · Tailwind CSS
- **Backend:** C# · ASP.NET Core Web API
- **Database:** PostgreSQL · Entity Framework Core
- **Authentication:** JWT Bearer tokens
- **Image Storage:** Cloudinary
- **Testing:** xUnit · FluentAssertions · Playwright
- **CI/CD:** GitHub Actions · Docker · Vercel

## Features

- Browse photographer portfolios filtered by style and location
- Register as a customer or photographer
- Book photography sessions with date and time selection
- Photographers manage their portfolio and incoming bookings
- Secure JWT authentication with role-based access control

## Local Development

### Prerequisites
- .NET 9 SDK
- Docker Desktop
- Node.js 20+

### Setup

1. Start the database:
   ```bash
   docker compose up -d db
   ```

2. Run backend migrations:
   ```bash
   cd PhotoFinder.Api/PhotoFinderAPI
   dotnet ef database update
   ```

3. Start the backend:
   ```bash
   dotnet run
   ```

4. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

API runs on `http://localhost:5015` · Frontend on `http://localhost:5173`
