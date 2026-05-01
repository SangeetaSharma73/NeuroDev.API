import dotenv from 'dotenv';

import app from './app';
import connectDB from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().catch((err: unknown) => {
  console.error('Failed to connect to DB', err);
});

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
