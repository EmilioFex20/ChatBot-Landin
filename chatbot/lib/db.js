import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "page";
const COLLECTION_NAME = "user";

if (!MONGODB_URI) {
  throw new Error("Por favor define la variable MONGODB_URI en .env.local");
}

let cached =
  global.mongoose || (global.mongoose = { conn: null, promise: null });

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);

  }

  cached.conn = await cached.promise;
  return cached.conn;
}
