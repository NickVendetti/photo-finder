import { PrismaClient } from "@prisma/client";

// Production-ready Prisma client with connection pooling and error handling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  errorFormat: "pretty",
});

// Global connection handling for serverless environments
let cachedPrisma = global.__prisma;

if (!cachedPrisma) {
  cachedPrisma = global.__prisma = prisma;
}

// Graceful shutdown handling
const cleanup = async () => {
  try {
    await prisma.$disconnect();
    console.log("Prisma client disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting Prisma client:", error);
  }
};

// Handle process termination
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("beforeExit", cleanup);

export default cachedPrisma;
