# Photography Booking Platform

A modern web application that connects photographers with clients, allowing users to discover photographers, view photo details, and book photography sessions.

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Discovery Page**: Browse available photographers
- **Booking System**: Schedule photography sessions with your favorite photographers
- **Photographer Dashboard**: Manage your portfolio and bookings as a photographer
- **Responsive Design**: Fully responsive interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Vitest, Testing Library
- **Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/nickvendetti/photo-finder.git
   cd photo-finder
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your environment variables
   ```
   VITE_API_URL=your_backend_url
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run coverage` - Generate test coverage report

## Project Structure

```
/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/       # React context providers
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main application component
│   └── index.css      # Global styles
└── package.json       # Project dependencies and scripts
```

## User Roles

- **User**: Can browse photographers, view photos, and book sessions
- **Photographer**: Can manage their profile, portfolio, and bookings

## Protected Routes

The application implements role-based access control with protected routes:
- `/discover` - Only accessible to regular users
- `/photo/:photoId` - Only accessible to regular users
- `/booking/:photographer_id` - Only accessible to regular users
- `/profile-dashboard` - Only accessible to photographers
- `/manage-bookings` - Only accessible to photographers


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
