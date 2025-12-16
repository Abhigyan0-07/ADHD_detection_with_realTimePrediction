import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string | undefined

let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing from environment variables');
    throw new Error('MONGODB_URI is not set. Add it to .env.local and restart the dev server.')
  }
  if (cached.conn) {
    // console.log('✅ Using cached database connection');
    return cached.conn;
  }
  if (!cached.promise) {
    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'focusflow',
    }).then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
    }).catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    });
  }
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn
}

