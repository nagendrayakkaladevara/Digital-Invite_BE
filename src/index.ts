import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';
import { validateEnv } from './config/env';

const PORT = process.env.PORT || 5000;

// Start server (local development only)
const startServer = async () => {
  validateEnv();
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
