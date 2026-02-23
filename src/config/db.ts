import mongoose from 'mongoose';

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const cached = (global as typeof globalThis & { mongoose?: Cached }).mongoose ?? { conn: null, promise: null };
if (!(global as typeof globalThis & { mongoose?: Cached }).mongoose) {
  (global as typeof globalThis & { mongoose?: Cached }).mongoose = cached;
}

export const connectDB = async (): Promise<void> => {
  if (cached.conn) return;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/marriage';
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000 })
      .then((conn) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`MongoDB connected: ${conn.connection.host}`);
        }
        cached.conn = conn;
        return conn;
      });
  }
  try {
    await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }
};
