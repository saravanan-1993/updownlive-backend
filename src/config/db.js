import mongoose from 'mongoose';

// Cache the connection across serverless invocations
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // Already connected — reuse
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.DATABASE_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('DATABASE_URI is not defined in environment variables');
  }

  // If a connection is in progress, wait for it
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false, // Fail fast instead of buffering when disconnected
    }).then((m) => {
      console.log(`✅ MongoDB connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // Reset so next request retries
    throw err;
  }

  return cached.conn;
};

export default connectDB;
