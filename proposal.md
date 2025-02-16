Capstone Project Step 2: Project Proposal

Project Name: Photo Finder

1. Tech Stack
- Front-end: React.js with Vite, Tailwind CSS for styling
- Back-end: Node.js with Express.js
- Database: PostgreSQL (hosted on Supabase)
- Authentication: JSON Web Tokens (JWT)
- API Integration: Unsplash API (or a custom-built API if required)

2. Project Focus**
- This will be a full-stack application with equal focus on both front-end and back-end.
- The front-end will be user-friendly, displaying images dynamically with filtering and search.
- The back-end will handle user authentication, storing user data, and managing search queries efficiently.

3. Type of Application**
- Web-based application optimized for desktop and mobile use.

4. Project Goal**
- Main Objective: Allow users to search for photographers based on filters or photographic categories.
- Users can browse photos uploaded by photographers and view their real-life portfolio.
- Clicking on a photo reveals photographer details and an option to contact them.

5. Target Users**
- Primary Users: Individuals looking for professional photographers.
- Secondary Users: Photographers seeking exposure and potential clients.
- Tertiary Users: Event organizers, businesses needing professional photography services.

6. Data Plan**
- API Usage: Unsplash API or a custom API to fetch and store image data.
- Custom Database: PostgreSQL to store user profiles, saved photos, and photographer details.
- Data Collection: Users will manually input their details; photographers will upload their portfolios.

7. Implementation Plan

Database Schema (Draft)
- Users Table: id, username, email, hashed_password, role (photographer/client)
- Photos Table: id, user_id (photographer), image_url, category, description
- Photographers Table: id, user_id, bio, contact_info, location
- Favorites Table: id, user_id, photo_id (for users to save favorite photos)

Potential API Issues
- Rate Limits: Some APIs have request limits, so caching strategies may be needed.
- Data Consistency: If using an external API, image data updates may not sync instantly.
- Permissions: Ensuring proper API keys and preventing abuse of API access.

Security Considerations
- Authentication: JWT tokens to protect routes and user data.
- Data Privacy: Encrypting sensitive user information.
- SQL Injection Protection: Using parameterized queries in database operations.

8. Functionality & User Flow
1. User Registration/Login: Users can sign up as a photographer or client.
2. Photo Search & Filters: Clients can search for photos based on category, location, or photographer.
3. Photographer Profiles: Clicking on a photo displays photographer details.
4. Saving Favorites: Users can save photos to a personal favorites list.
5. Messaging (Stretch Goal): Clients can message photographers directly within the platform.

9. Stretch Features
- Advanced Search: Implementing AI-based image recognition for better search results.
- Review & Rating System: Clients can leave reviews for photographers.
- Social Media Sharing: Users can share photographer profiles on social media.
- Photo Upload Verification: AI-driven quality control to verify high-quality images.

Next Steps:
- Start database schema implementation.
- Configure authentication and API access.
- Develop initial UI wireframes for front-end components.