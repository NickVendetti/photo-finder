import app from "./app.js";

const PORT = process.env.PORT || 5004;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

export default server;
