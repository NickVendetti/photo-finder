# Build stage
FROM node:20-alpine AS builder

# Accept build arguments
ARG DATABASE_URL
ARG NODE_ENV

# Set environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client with the provided DATABASE_URL
RUN npx prisma generate

# Copy application code
COPY . .

# Build the application (if you're using TypeScript or need to build)
RUN npm run build

# Production stage
FROM node:20-alpine

# Accept build arguments again for the production stage
ARG DATABASE_URL
ARG NODE_ENV

# Set environment variables for the production stage
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy built application and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Start the application
CMD ["npm", "start"]