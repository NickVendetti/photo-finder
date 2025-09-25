import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

import userRoutes from "./routes/users.js";
// import photographerRoutes from "./routes/photographers.js";
import photoRoutes from "./routes/photos.js";
// import reviewRoutes from "./routes/reviews.js";
import bookingRoutes from "./routes/bookings.js";
import authRoutes from "./routes/auth.js";
import prisma from "./prisma/client.js";

export const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/users", userRoutes);
// app.use("/photographers", photographerRoutes);
app.use("/photos", photoRoutes);
// app.use("/reviews", reviewRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);

// Enhanced health check with debugging
app.get("/health", async (req, res) => {
  try {
    // Test raw SQL query
    await prisma.$queryRaw`SELECT 1`;

    // Test Prisma client operation
    await prisma.user.findFirst();

    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint for database connectivity troubleshooting
app.get("/debug/db", async (req, res) => {
  const results = {};

  try {
    // 1. Test raw SQL query
    const rawResult = await prisma.$queryRaw`SELECT 1 as test_value, NOW() as db_time`;
    results.rawQuery = { success: true, result: rawResult };
  } catch (error) {
    results.rawQuery = { success: false, error: error.message };
  }

  try {
    // 2. Test Prisma findFirst
    const findResult = await prisma.user.findFirst({
      select: { id: true, email: true },
      take: 1
    });
    results.prismaFind = { success: true, result: findResult || "No users found" };
  } catch (error) {
    results.prismaFind = { success: false, error: error.message };
  }

  try {
    // 3. Test Prisma connection info
    const connectionInfo = {
      url: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@') : 'not set',
      nodeEnv: process.env.NODE_ENV,
      renderUrl: process.env.RENDER_EXTERNAL_URL || 'not set',
    };
    results.connectionInfo = connectionInfo;
  } catch (error) {
    results.connectionInfo = { error: error.message };
  }

  try {
    // 4. Test Prisma client status
    const clientStatus = {
      isConnected: prisma._engine?.connection?._connected || 'unknown',
      engineType: prisma._engine?.constructor?.name || 'unknown',
    };
    results.clientStatus = clientStatus;
  } catch (error) {
    results.clientStatus = { error: error.message };
  }

  res.json({
    timestamp: new Date().toISOString(),
    results
  });
});

export default app;
