import mongoose from "mongoose";

// Reuse one connection across hot reloads in dev and across requests in prod
const cached = (globalThis.__mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local.");

  cached.promise ??= mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 10000 });
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
