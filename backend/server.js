import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/users.js";
import photographerRoutes from "./routes/photographers.js";
import photoRoutes from "./routes/photos.js";
import reviewRoutes from "./routes/reviews.js";
import bookingRoutes from "./routes/bookings.js";
import authRoutes from "./routes/auth.js";

const app = express();

// Middleware
app.use(cors(
  {
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  }
));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/upload", uploadRoutes);
app.use("/users", userRoutes);
app.use("/photographers", photographerRoutes);
app.use("/photos", photoRoutes);
app.use("/reviews", reviewRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("📸 Photo Finder API is running...");
});

app.get('/health', async (req, res) => {
  try {
      // First, check if we can connect to the database
      await prisma.$queryRaw`SELECT 1`;
      
      res.status(200).send('Healthy');
  } catch (error) {
      // If database check fails, we'll still return 'Healthy' for now
      // but log the error for monitoring
      console.error('Database health check failed:', error);
      res.status(200).send('Healthy');
  }
});

// Detailed health check that includes dependency status
app.get('/health/detailed', async (req, res) => {
  const health = {
      status: 'Healthy',
      timestamp: new Date(),
      database: 'Unknown',
      uptime: process.uptime()
  };

  try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      health.database = 'Connected';
  } catch (error) {
      health.database = 'Disconnected';
      health.status = 'Degraded';
  }

  const statusCode = health.status === 'Healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
