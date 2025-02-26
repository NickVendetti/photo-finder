import app from './app.js';

const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => 
  console.log(`🚀 Server running on port ${PORT}`)
);

export default server;