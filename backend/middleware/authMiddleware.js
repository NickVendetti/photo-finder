// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// /** Middleware to protect routes */
// export const protect = async (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1]; // Get token from header

//   if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

//   try {
//     // token verification
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // check if user exists in database
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: { id: true, user_type: true }
//     });

//     if (!user) {
//       return res.status(401).json({ error: "User no longer exists" });
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Invalid or expired token." });
//   }
// };

// //middleware to check specific user types
// export const checkUserType = (allowedTypes) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }

//     if (allowedTypes.includes(req.user.user_type)) {
//       next();
//     } else {
//       res.status(403).json({ error: "Not authorized for this resource" });
//     }
//   };
// };
