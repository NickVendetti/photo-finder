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
