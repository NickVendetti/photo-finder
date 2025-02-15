import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/** Middleware to protect routes */
export const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from header

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = decoded; // Attach user data to request
    next(); // Proceed to the next function
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};