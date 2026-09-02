
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    // Reuse an existing MongoDB connection
    // when running in a serverless environment.
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `[HireMind DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`
    );

    return conn;
  } catch (error) {
    console.error(
      `[HireMind DB Error] MongoDB Connection Failed: ${error.message}`
    );

    // Do not use process.exit() in a serverless environment.
    throw error;
  }
};

export default connectDB;

