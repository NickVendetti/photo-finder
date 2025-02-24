# Build stage for dependencies and Prisma client generation
FROM node:18-alpine AS builder

# Accept build arguments
ARG DATABASE_URL
ARG NODE_ENV

# Set as environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy files from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY . .

# Set production environment variables
ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

# Start the application
CMD ["npm", "start"]