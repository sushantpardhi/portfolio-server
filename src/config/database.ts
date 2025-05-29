import mongoose from "mongoose";
import logger from "../utils/logger";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Set higher max listeners limit for mongoose connection
mongoose.connection.setMaxListeners(15);

// Function to remove existing listeners
const removeExistingListeners = () => {
  mongoose.connection.removeAllListeners("error");
  mongoose.connection.removeAllListeners("disconnected");
};

export async function dbConnection(retryCount = 0): Promise<void> {
  const MONGODB_URI: string =
    process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

  try {
    // Remove any existing listeners before adding new ones
    removeExistingListeners();
 
    // Configure MongoDB options
    const options = {
      autoIndex: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 50,
    };

    await mongoose.connect(MONGODB_URI, options);

    mongoose.connection.on("error", (error) => {
      logger.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("❗MongoDB disconnected");
      if (retryCount < MAX_RETRIES) {
        logger.info(
          `Attempting to reconnect... (Attempt ${
            retryCount + 1
          }/${MAX_RETRIES})`
        );
        setTimeout(() => {
          dbConnection(retryCount + 1);
        }, RETRY_DELAY);
      } else {
        logger.error("Failed to reconnect after maximum attempts");
        process.exit(1);
      }
    });

    // If the Node process ends, close the MongoDB connection
    process.once("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed through app termination");
        process.exit(0);
      } catch (error) {
        logger.error("Error closing MongoDB connection:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    logger.error("❌ Error connecting to database:", error);
    if (retryCount < MAX_RETRIES) {
      logger.info(
        `Retrying connection in ${RETRY_DELAY / 1000} seconds... (Attempt ${
          retryCount + 1
        }/${MAX_RETRIES})`
      );
      setTimeout(() => {
        dbConnection(retryCount + 1);
      }, RETRY_DELAY);
    } else {
      logger.error("Failed to connect to database after maximum attempts");
      throw error;
    }
  }
}
