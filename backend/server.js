import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/upload", uploadRoutes); // Cloudinary upload route

app.listen(5000, () => console.log("Server running on port 5000"));
