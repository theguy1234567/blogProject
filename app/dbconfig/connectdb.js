import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  // Reuse existing live connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("✅ Reusing existing MongoDB connection");
    return cached.conn;
  }

  // Create new connection promise if none in flight
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected:", mongoose.connection.name);
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // reset so next call retries
    throw error; // bubble up — don't swallow it
  }

  return cached.conn;
}
