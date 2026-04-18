import mongoose from "mongoose";
import { Mona_Sans } from "next/font/google";
const MONGO_URI = process.env.MONGO_URI;
// console.log(MONGO_URI);

export default async function connectDB() {
  try {
    if (!MONGO_URI) {
      throw new Error("NO MONGO URI!");
    }
    if (mongoose.connection.readyState == 1) {
      console.log("ALready connected ");
      return;
    }

    await mongoose.connect(MONGO_URI);
    console.log("Connected succesfully");
    console.log("✅ Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.log("❌ DB connection failed", error);
  }
}
