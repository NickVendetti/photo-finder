# Build stage
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL

# Make it available as an environment variable during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
COPY vite.config.js ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]