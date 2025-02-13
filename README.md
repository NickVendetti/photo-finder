# Photo Finder - Capstone Project

## Overview
Photo Finder is a platform where users can find photographers based on their style, location, and portfolio. Users can browse images from **Flickr** and **user-uploaded content**, leave reviews, and contact photographers.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL
- **Database ORM:** Prisma
- **Authentication:** JWT
- **APIs:** Flickr API, Cloudinary API

## Data Sources
- **Flickr API** (for public images):
  - [API Docs](https://www.flickr.com/services/api/)
  - Base URL: `https://www.flickr.com/services/rest/`
- **Cloudinary** (for user uploads):
  - [API Docs](https://cloudinary.com/documentation)
  - Stores user-uploaded images

## Environment Variables
Create a `.env` file in the **backend** directory with:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
VITE_FLICKR_API_KEY=your_flickr_api_key
VITE_FLICKR_API_SECRET=your_flickr_api_secret
VITE_API_BASE_URL=https://www.flickr.com/services/rest/
```

## Database Schema
Schema is located in `backend/database/schema.sql`. It includes:
- Users
- Photographers
- Photos (Flickr & user uploads)
- Reviews

## Next Steps
- Implement API routes
- Frontend integration
- Testing & deployment
