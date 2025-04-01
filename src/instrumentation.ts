import mongoose from "mongoose";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable");
    }

    // Check if we already have a connection
    if (mongoose.connections[0].readyState) {
      console.log("Using existing MongoDB connection");
      return;
    }

    try {
      // Connection options
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      // Connect to MongoDB
      await mongoose.connect(MONGODB_URI, opts);
      console.log("MongoDB connected successfully");

      // Handle connection errors after initial connection
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }
}
