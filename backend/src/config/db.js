import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if(!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;