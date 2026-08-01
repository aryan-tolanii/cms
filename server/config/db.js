import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
  try {
    // Temporary workaround for the DNS issue
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
