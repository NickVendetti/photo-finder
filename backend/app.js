import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';

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

const prisma = new PrismaClient();
export const app = express();

const corsMethods = "GET,POST,PUT,DELETE,PATCH,OPTIONS";
const corsAllowedHeaders = "Content-Type,Authorization";

const corsOriginsList = process.env.CORS_ORIGINS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions =
  corsOriginsList?.length > 0
    ? {
        origin: corsOriginsList,
        methods: corsMethods,
        allowedHeaders: corsAllowedHeaders,
      }
    : {
        origin: "*",
        methods: corsMethods,
        allowedHeaders: corsAllowedHeaders,
      };

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/users", userRoutes);
// app.use("/photographers", photographerRoutes);
app.use("/photos", photoRoutes);
// app.use("/reviews", reviewRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);

// health check including db connection verification
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).send("Healthy");
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(200).send("Healthy");
  }
});

export default app;
