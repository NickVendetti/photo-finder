# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy the rest of the backend code
COPY . .

# Copy Prisma schema and generate Prisma Client for Linux inside the container
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Set environment variables (override in container runtime)
ENV NODE_ENV=production PORT=6000

# Expose backend port
EXPOSE 6000

# Start the Express server
CMD ["node", "server.js"]
