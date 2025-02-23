# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

ARG DATABASE_URL
ARG NODE_ENV

# Set environment variables for the production stage
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=${NODE_ENV}

# Generate the prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy the rest of the backend code
COPY . .

# Set environment variables (override in container runtime)
ENV NODE_ENV=production PORT=6000

# Expose backend port
EXPOSE 6000

# Start the Express server
CMD ["node", "server.js"]
