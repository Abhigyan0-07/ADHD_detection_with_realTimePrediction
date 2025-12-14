import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string | undefined

let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to .env.local and restart the dev server.')
  }
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'focusflow',
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

